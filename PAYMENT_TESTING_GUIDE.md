# Quick Start Guide - Razorpay Payment Testing

## Prerequisites
- MySQL database running on localhost:3306
- Backend Spring Boot application
- Frontend React application

## Step 1: Start the Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on: http://localhost:8080

## Step 2: Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will start on: http://localhost:5173

## Step 3: Test Payment Flow

### 3.1 Register/Login
1. Navigate to http://localhost:5173
2. Register a new user or login
3. Login credentials will be stored in localStorage

### 3.2 Book a Room
1. Browse available rooms
2. Click "Book Now" on any room
3. Select check-in and check-out dates
4. Click "Proceed to Payment"

### 3.3 Complete Payment
1. Razorpay checkout modal will open
2. Use test card details:
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** 123
   - **Expiry:** 12/25
   - **Name:** Test User

3. Click "Pay Now"

### 3.4 Verify Success
1. You should see "Payment successful!" alert
2. You'll be redirected to "My Bookings" page
3. Booking status should show "CONFIRMED"

## API Endpoints

### Create Order
```http
POST http://localhost:8080/api/payments/create-order
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "bookingId": 1,
  "amount": 1500.00
}
```

### Verify Payment
```http
POST http://localhost:8080/api/payments/verify
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

## Database Verification

### Check Booking Status
```sql
SELECT id, status, razorpay_order_id, total_amount 
FROM bookings 
ORDER BY id DESC 
LIMIT 5;
```

### Check Payment Records
```sql
SELECT id, booking_id, razorpay_order_id, razorpay_payment_id, payment_status, amount 
FROM payments 
ORDER BY id DESC 
LIMIT 5;
```

## Test Scenarios

### ✅ Successful Payment
1. Create booking
2. Complete payment with valid test card
3. Verify booking status = CONFIRMED
4. Verify payment status = SUCCESS

### ❌ Failed Payment
1. Create booking
2. Use failure test card: 4000 0000 0000 0002
3. Verify booking status = CANCELLED
4. Verify payment status = FAILED

### 🚫 Cancelled Payment
1. Create booking
2. Close Razorpay modal without paying
3. Verify booking status = PENDING
4. Verify error message shown

## Troubleshooting

### Issue: Razorpay modal doesn't open
- Check browser console for errors
- Verify Razorpay script is loaded in index.html
- Check if order was created successfully

### Issue: Payment verification fails
- Check backend logs for signature verification errors
- Verify Razorpay secret key is correct
- Check network tab for API response

### Issue: 401 Unauthorized
- Verify JWT token is present in localStorage
- Check if token has expired
- Re-login if necessary

### Issue: Booking not found
- Verify booking was created before payment
- Check booking ID in API request
- Verify database connection

## Razorpay Dashboard

Access your Razorpay test dashboard:
- URL: https://dashboard.razorpay.com/
- Login with your Razorpay account
- View test payments under "Transactions"

## Important Notes

⚠️ **Test Mode:**
- Currently using test API keys
- No real money is charged
- Test cards only work in test mode

⚠️ **Production:**
- Replace test keys with live keys
- Enable HTTPS
- Set up webhooks for payment notifications
- Implement proper error handling and logging

## Support

If you encounter issues:
1. Check backend logs: `backend/logs/`
2. Check browser console for frontend errors
3. Verify database connection
4. Check Razorpay dashboard for payment status
