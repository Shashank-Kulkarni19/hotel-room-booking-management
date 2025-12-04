import axiosInstance from './axiosConfig';

export const userApi = {
  getAllUsers: async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (id, enabled) => {
    const response = await axiosInstance.put(`/admin/users/${id}/status?enabled=${enabled}`);
    return response.data;
  },
};

