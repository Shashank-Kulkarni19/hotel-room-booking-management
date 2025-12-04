import axiosInstance from './axiosConfig';

export const authApi = {
  register: async (registerData) => {
    const response = await axiosInstance.post('/auth/register', registerData);
    return response.data;
  },

  login: async (loginData) => {
    const response = await axiosInstance.post('/auth/login', loginData);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  },
};

