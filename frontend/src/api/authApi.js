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

  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email, password) => {
    const response = await axiosInstance.post('/auth/reset-password', { email, password });
    return response.data;
  },
};

