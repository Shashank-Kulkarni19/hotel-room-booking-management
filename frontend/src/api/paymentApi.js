import axiosInstance from './axiosConfig';

/**
 * Payment API service for Razorpay integration
 */

/**
 * Create a Razorpay order
 * @param {number} bookingId - The booking ID
 * @param {number} amount - The amount to be paid
 * @returns {Promise} - Order details from backend
 */
export const createOrder = async (bookingId, amount) => {
  try {
    const response = await axiosInstance.post('/payments/create-order', {
      bookingId,
      amount
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment
 * @param {object} paymentData - Payment verification data
 * @returns {Promise} - Verification response
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments/verify', {
      razorpayOrderId: paymentData.razorpay_order_id,
      razorpayPaymentId: paymentData.razorpay_payment_id,
      razorpaySignature: paymentData.razorpay_signature
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Refund a Razorpay payment
 * @param {number} bookingId - The booking ID
 * @returns {Promise} - Refund response
 */
export const refundPayment = async (bookingId) => {
  try {
    const response = await axiosInstance.post(`/payments/refund/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error refunding payment:', error);
    throw error;
  }
};
