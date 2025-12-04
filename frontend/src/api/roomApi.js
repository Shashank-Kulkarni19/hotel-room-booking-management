import axiosInstance from './axiosConfig';

export const roomApi = {
  getAllRooms: async () => {
    const response = await axiosInstance.get('/rooms');
    return response.data;
  },

  getAvailableRooms: async () => {
    const response = await axiosInstance.get('/rooms/available');
    return response.data;
  },

  getAvailableRoomsForDateRange: async (checkInDate, checkOutDate) => {
    const response = await axiosInstance.get('/rooms/available/date-range', {
      params: { checkInDate, checkOutDate },
    });
    return response.data;
  },

  getRoomById: async (id) => {
    const response = await axiosInstance.get(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (roomData, image) => {
    const formData = new FormData();
    formData.append('roomType', roomData.roomType);
    formData.append('roomNumber', roomData.roomNumber);
    formData.append('description', roomData.description || '');
    formData.append('price', roomData.price);
    formData.append('totalRooms', roomData.totalRooms);
    if (roomData.amenities && Array.isArray(roomData.amenities)) {
      roomData.amenities.forEach((a) => formData.append('amenities', a));
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosInstance.post('/admin/rooms', formData);
    return response.data;
  },

  updateRoom: async (id, roomData, image) => {
    const formData = new FormData();
    formData.append('roomType', roomData.roomType);
    formData.append('roomNumber', roomData.roomNumber);
    formData.append('description', roomData.description || '');
    formData.append('price', roomData.price);
    formData.append('totalRooms', roomData.totalRooms);
    if (roomData.amenities && Array.isArray(roomData.amenities)) {
      roomData.amenities.forEach((a) => formData.append('amenities', a));
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await axiosInstance.put(`/admin/rooms/${id}`, formData);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await axiosInstance.delete(`/admin/rooms/${id}`);
    return response.data;
  },

  getRoomsByType: async (roomType) => {
    const response = await axiosInstance.get(`/rooms/type/${roomType}`);
    return response.data;
  },

  getAvailableRoomsByType: async (roomType) => {
    const response = await axiosInstance.get(`/rooms/type/${roomType}/available`);
    return response.data;
  },

  getAllRoomTypes: async () => {
    const response = await axiosInstance.get('/rooms/types/all');
    return response.data;
  },
};

