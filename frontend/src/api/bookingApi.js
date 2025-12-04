import axiosInstance from './axiosConfig';

export const bookingApi = {
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await axiosInstance.get('/bookings/my-bookings');
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await axiosInstance.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await axiosInstance.get('/admin/bookings');
    return response.data;
  },
};

