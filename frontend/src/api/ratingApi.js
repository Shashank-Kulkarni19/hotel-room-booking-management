import axiosInstance from './axiosConfig';

export const ratingApi = {
  addRating: async (userId, ratingData) => {
    const response = await axiosInstance.post('/ratings', ratingData, {
      headers: {
        'X-User-Id': userId,
      },
    });
    return response.data;
  },

  updateRating: async (userId, ratingId, ratingData) => {
    const response = await axiosInstance.put(`/ratings/${ratingId}`, ratingData, {
      headers: {
        'X-User-Id': userId,
      },
    });
    return response.data;
  },

  deleteRating: async (userId, ratingId) => {
    const response = await axiosInstance.delete(`/ratings/${ratingId}`, {
      headers: {
        'X-User-Id': userId,
      },
    });
    return response.data;
  },

  getRatingsByRoomId: async (roomId) => {
    const response = await axiosInstance.get(`/ratings/room/${roomId}`);
    return response.data;
  },

  getRatingsByUserId: async (userId) => {
    const response = await axiosInstance.get(`/ratings/user/${userId}`);
    return response.data;
  },

  getAverageRatingByRoomId: async (roomId) => {
    const response = await axiosInstance.get(`/ratings/room/${roomId}/average`);
    return response.data;
  },

  getRatingCountByRoomId: async (roomId) => {
    const response = await axiosInstance.get(`/ratings/room/${roomId}/count`);
    return response.data;
  },
};
