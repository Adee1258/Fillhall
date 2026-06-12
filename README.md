# FillHall - Luxury Wedding Marketplace

A complete luxury wedding marketplace web application with AI concierge, venue directory, and admin dashboard.

## Features

### User Side
- **AI Concierge Welcome Screen**: Luxury maroon and gold theme with Zara the AI assistant
- **Main Directory**: Browse verified wedding venues and services
- **Search & Filter**: Search by name, filter by category
- **WhatsApp Integration**: Instant booking via WhatsApp
- **Mobile Responsive**: Fully responsive design

### Admin Side
- **Admin Dashboard**: Statistics and listing management
- **CRUD Operations**: Create, edit, delete listings
- **Image Upload**: Upload logos/images for listings
- **JWT Authentication**: Secure admin login

## Tech Stack

**Frontend**: HTML5, CSS3, Vanilla JavaScript  
**Backend**: Node.js, Express.js  
**Database**: MongoDB (Mongoose ODM)  
**Authentication**: JWT  
**File Upload**: Multer

## Setup Instructions

1. **Install MongoDB**: Make sure MongoDB is installed and running on your system

2. **Configure Environment**:
   - Go to `server/.env`
   - Update MONGODB_URI if needed
   - Update JWT_SECRET for security
   - Default admin credentials: admin@fillhall.com / admin123

3. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

5. **Access the Application**:
   - Open browser and go to `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin-login.html`

## Project Structure

```
Fillhall/
├── client/
│   ├── welcome.html          # AI Concierge welcome screen
│   ├── index.html            # Main directory page
│   ├── admin-login.html      # Admin login page
│   ├── admin-dashboard.html  # Admin dashboard
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   ├── welcome.js        # Welcome screen logic
│   │   ├── index.js          # Directory page logic
│   │   ├── admin-login.js    # Login logic
│   │   └── admin-dashboard.js # Dashboard logic
│   └── assets/               # Static assets
├── server/
│   ├── app.js                # Main server file
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── routes/               # API routes
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth and upload middleware
│   ├── models/               # Database models
│   └── uploads/              # Uploaded images
└── README.md
```

## Default Credentials

- **Admin Email**: admin@fillhall.com
- **Admin Password**: admin123
