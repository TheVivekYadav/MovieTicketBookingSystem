# 🎬 Movie Ticket Booking System

A backend movie ticket booking web application that allows users to register, browse movies, book specific seats for shows, and pay securely via Razorpay. Built with Node.js, Express, MongoDB.

---

## 🌐 Live Demo

> 🔗 [https://movieticketbookingsystem.onrender.com/](https://movieticketbookingsystem.onrender.com/) 

---

## 🚀 Tech Stack

**Frontend:**
- HTML, CSS, JavaScript

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas (Mongoose)
- Razorpay (Payment Integration)
- JWT Authentication

**Deployment:**
- Render (Backend)
- MongoDB Atlas (Cloud Database)

---

## 🧩 Features

- ✅ User Registration & Login
- ✅ JWT + Cookie Authentication
- ✅ Email Verification
- ✅ Change Password (while logged in)
- ✅ Admin-only access for creating:
  - Movies
  - Cinemas
  - Shows
- ✅ Seat-based Booking System
- ✅ Razorpay Integration for Payment
- ✅ Booking History for Users
- ✅ Cancel Bookings (and free up seats)
- ✅ Role-based Middleware Authorization
- ✅ Email Confirmation on Successful Booking

---

## 🔑 Environment Variables (`.env`)

```env
PORT=
MONGO_URI=

MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_PORT=
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```
## 📦 API Endpoints (Sample)

### ✅ Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET  /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/resetpassword`

### 🎬 Movies
- `GET  /api/v1/movie`
- `POST /api/v1/movie` *(Admin only)*
- `PUT  /api/v1/movie/:id`
- `DELETE /api/v1/movie/:id`

### 🏢 Cinemas & Screens
- `GET /api/v1/cinema`
- `GET /api/v1/cinema/:id/screens`

### 📅 Shows
- `GET  /api/v1/shows`
- `POST /api/v1/shows` *(Admin only)*
- `DELETE /api/v1/shows/:id`

### 🎟️ Booking
- `POST /api/v1/booking/create`
- `GET  /api/v1/booking/me`
- `DELETE /api/v1/booking/cancel/:id`

### 💳 Payments
- `POST /api/v1/pay/:orderId`
- `POST /api/v1/verify`
- `GET  /api/v1/order/:orderId/status`

---
## Important to do payment take orderId and go to
### orderId is generated when booking is initiated
```bash
https://movieticketbookingsystem.onrender.com/pay?orderId=order
```

## 💻 How to Run Locally


# Clone repo
```bash
git clone https://github.com/thevivekyadav/MovieTicketBookingSystem.git
```
# Install dependencies
```bash
npm install
```

# Start server
```bash
npm start
```

## 👨‍💻 Developed By

**Vivek Yadav**  
GitHub: [@TheVivekYadav](https://github.com/TheVivekYadav)  
Email: vivekyadav7021625953@gmail.com
Alternate Email: vivekyadavclasher@gmail.com

---
