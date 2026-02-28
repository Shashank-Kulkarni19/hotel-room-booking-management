import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { roomApi } from '../../api/roomApi';
import { bookingApi } from '../../api/bookingApi';
import { userApi } from '../../api/userApi';
import { ratingApi } from '../../api/ratingApi';
import { useAuth } from '../../context/AuthContext';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    metrics: {
      totalRooms: 0,
      totalRevenue: 0,
      totalAvailableRooms: 0,
      totalUsers: 0,
      avgRating: 0,
      occupancyRate: 0
    },
    weeklyBookings: [],
    monthlyRevenue: [],
    availabilityStatus: [],
    roomTypeDistribution: [],
    recentWeeklyBookings: [],
    revenueTrend: [],
    occupancyForecast: [],
    ratingAnalysis: [],
    leadTimeDistribution: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [rooms, bookings, users] = await Promise.all([
        roomApi.getAllRooms(),
        bookingApi.getAllBookings(),
        userApi.getAllUsers(),
      ]);

      // Attempt to get ratings for each room to build rating analysis
      const ratingsPromises = rooms.map(room => ratingApi.getRatingsByRoomId(room.id).catch(() => []));
      const allRatingsArrays = await Promise.all(ratingsPromises);
      const allRatings = allRatingsArrays.flat();

      processData(rooms, bookings, users, allRatings);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  const processData = (rooms, bookings, users, ratings) => {
    const totalRoomsCount = rooms.reduce((sum, r) => sum + (r.totalRooms || 1), 0);
    const totalAvailableRooms = rooms.filter(r => r.available).length;
    const totalUsers = users.length;
    
    // Total Revenue (only confirmed bookings)
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Metrics
    const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : 0;
    const occupancyRate = totalRoomsCount > 0 ? (((totalRoomsCount - totalAvailableRooms) / totalRoomsCount) * 100).toFixed(1) : 0;

    // Weekly Bookings Chart (Last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const weeklyBookings = last7Days.map(date => {
      const count = bookings.filter(b => b.bookingDate && b.bookingDate.split('T')[0] === date).length;
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { name: dayName, bookings: count };
    });

    // Monthly Revenue Trend (Line Chart)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const revenueTrend = months.map((month, index) => {
      const rev = confirmedBookings.filter(b => {
        const d = new Date(b.bookingDate);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      }).reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      return { name: month, revenue: rev };
    });

    // Room Availability Pie Chart
    const availabilityStatus = [
      { name: 'Available', value: totalAvailableRooms },
      { name: 'Occupied', value: totalRoomsCount - totalAvailableRooms }
    ];

    // Room Type Distribution Pie Chart
    const typeCounts = {};
    bookings.forEach(b => {
      const type = b.roomType || 'Other';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    const roomTypeDistribution = Object.keys(typeCounts).map(type => ({
      name: type,
      value: typeCounts[type]
    }));

    // Guest Rating Analysis by Room Type
    const roomTypeRatings = {};
    ratings.forEach(r => {
      const room = rooms.find(room => room.id === r.roomId);
      const type = room ? room.roomType : 'Unknown';
      if (!roomTypeRatings[type]) roomTypeRatings[type] = { total: 0, count: 0 };
      roomTypeRatings[type].total += r.rating;
      roomTypeRatings[type].count += 1;
    });
    const ratingAnalysis = Object.keys(roomTypeRatings).map(type => ({
      name: type,
      rating: parseFloat((roomTypeRatings[type].total / roomTypeRatings[type].count).toFixed(1))
    }));

    // Occupancy Forecast (Next 7 days)
    const next7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });
    const occupancyForecast = next7Days.map(date => {
      const targetDate = new Date(date);
      const count = bookings.filter(b => {
        const checkIn = new Date(b.checkInDate);
        const checkOut = new Date(b.checkOutDate);
        return targetDate >= checkIn && targetDate < checkOut && b.status !== 'CANCELLED';
      }).length;
      return { 
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }), 
        occupancy: count 
      };
    });

    // Lead Time Distribution
    const leadTimeGroups = { '0-2 days': 0, '3-7 days': 0, '8-14 days': 0, '15+ days': 0 };
    bookings.forEach(b => {
      if (!b.bookingDate || !b.checkInDate) return;
      const bookingDate = new Date(b.bookingDate);
      const checkInDate = new Date(b.checkInDate);
      const diffDays = Math.ceil((checkInDate - bookingDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 2) leadTimeGroups['0-2 days']++;
      else if (diffDays <= 7) leadTimeGroups['3-7 days']++;
      else if (diffDays <= 14) leadTimeGroups['8-14 days']++;
      else leadTimeGroups['15+ days']++;
    });
    const leadTimeDistribution = Object.keys(leadTimeGroups).map(key => ({ name: key, count: leadTimeGroups[key] }));

    // Recent Bookings
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentWeeklyBookings = bookings.filter(b => new Date(b.bookingDate) >= sevenDaysAgo)
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    setData({
      metrics: {
        totalRooms: totalRoomsCount,
        totalRevenue,
        totalAvailableRooms,
        totalUsers,
        avgRating,
        occupancyRate
      },
      weeklyBookings,
      monthlyRevenue: revenueTrend,
      availabilityStatus,
      roomTypeDistribution,
      recentWeeklyBookings,
      revenueTrend,
      occupancyForecast,
      ratingAnalysis,
      leadTimeDistribution
    });
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center pt-navbar">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light pt-navbar pb-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-0">Analytics <span className="text-primary">Master</span></h1>
            <p className="text-muted">Comprehensive performance insights for your hotel business.</p>
          </div>
          <button onClick={fetchAnalytics} className="btn btn-white shadow-sm border">
            🔄 Refresh Data
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Top Level Scorecards */}
        <div className="row g-4 mb-5">
          {[
            { title: 'Total Revenue', value: `₹${data.metrics.totalRevenue.toLocaleString()}`, icon: '💰', color: '#10b981', trend: '+12% growth' },
            { title: 'Occupancy Rate', value: `${data.metrics.occupancyRate}%`, icon: '📊', color: '#6366f1', trend: 'Active users' },
            { title: 'Avg Guest Rating', value: `${data.metrics.avgRating} / 5`, icon: '⭐', color: '#f59e0b', trend: 'Based on reviews' },
            { title: 'Total Users', value: data.metrics.totalUsers, icon: '👥', color: '#3b82f6', trend: 'Registered accounts' },
          ].map((item, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <div className="glass-card p-4 border-0 shadow-sm h-100 position-relative overflow-hidden">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="fs-1">{item.icon}</div>
                  <div className="badge rounded-pill" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    {item.trend}
                  </div>
                </div>
                <p className="text-muted small text-uppercase fw-bold mb-1">{item.title}</p>
                <h2 className="fw-bold mb-0">{item.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Row 1: Main Trends */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="glass-card p-4 border-0 shadow-sm">
              <h5 className="fw-bold mb-4">Revenue trend & Performance (Current Year)</h5>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <AreaChart data={data.revenueTrend}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-card p-4 border-0 shadow-sm h-100">
              <h5 className="fw-bold mb-4">Occupancy Forecast (Next 7 Days)</h5>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={data.occupancyForecast}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="occupancy" fill="#6366f1" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Distributions & Analysis */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="glass-card p-4 border-0 shadow-sm">
              <h5 className="fw-bold mb-4">Booking Lead Time</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.leadTimeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.leadTimeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-card p-4 border-0 shadow-sm">
              <h5 className="fw-bold mb-4">Rating by Room Type</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart layout="vertical" data={data.ratingAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                    <XAxis type="number" domain={[0, 5]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="rating" fill="#f59e0b" radius={[0, 10, 10, 0]} barSize={25} label={{ position: 'right' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-card p-4 border-0 shadow-sm">
              <h5 className="fw-bold mb-4">Availability Overview</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.availabilityStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      dataKey="value"
                    >
                      {data.availabilityStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Data Table */}
        <div className="glass-card border-0 shadow-sm overflow-hidden mb-5">
          <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Live Booking Feed</h5>
            <span className="badge badge-success">Activity Tracked</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 small text-uppercase text-muted">Guest</th>
                  <th className="py-3 border-0 small text-uppercase text-muted">Room Details</th>
                  <th className="py-3 border-0 small text-uppercase text-muted">Check In/Out</th>
                  <th className="py-3 border-0 small text-uppercase text-muted">Status</th>
                  <th className="py-3 border-0 small text-uppercase text-muted text-end">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentWeeklyBookings.length > 0 ? (
                  data.recentWeeklyBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                            {booking.userName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="fw-bold">{booking.userName}</div>
                            <div className="small text-muted">{booking.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-dark fw-medium">{booking.roomType}</span>
                        <div className="small text-muted">Room #{booking.roomNumber}</div>
                      </td>
                      <td className="py-3">
                        <div className="small fw-medium">{new Date(booking.checkInDate).toLocaleDateString()}</div>
                        <div className="small text-muted">to {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3">
                        <span className={`badge ${
                          booking.status === 'CONFIRMED' ? 'badge-success' : 
                          booking.status === 'PENDING' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 text-end px-4">
                        <div className="fw-bold text-dark">₹{booking.totalAmount?.toLocaleString()}</div>
                        <div className="small text-muted">via Razorpay</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No recent bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

