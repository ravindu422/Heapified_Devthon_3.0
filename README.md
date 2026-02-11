# SafeLanka - Crisis Management System

This repository is for Devthon 3.0 competition - A comprehensive crisis management system to help coordinate emergency responses.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ravindu422/Heapified_Devthon_3.0.git
cd Heapified_Devthon_3.0
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env  # Optional, if needed
npm run dev
```

4. **Verify Installation**
```bash
# From project root
./verify.sh
```

## 📚 Documentation

- **[VERIFICATION.md](VERIFICATION.md)** - Complete guide on how to verify fixes and changes
- **[TESTING.md](TESTING.md)** - Comprehensive testing procedures and test cases

## 🔍 How to Check After a Fix

After making any changes or fixes, follow these steps:

### 1. Run the Quick Verification Script
```bash
./verify.sh
```

This script checks:
- ✅ Node.js and npm installation
- ✅ MongoDB connectivity
- ✅ Backend and frontend setup
- ✅ Running services
- ✅ Environment configuration

### 2. Check Backend Health
```bash
# Check if backend is running
curl http://localhost:5080/health

# Check database
cd backend
node check-database.js
```

### 3. Check Frontend
- Open browser: `http://localhost:5173`
- Open DevTools Console (F12)
- Look for errors in Console and Network tabs

### 4. Test Your Specific Fix
- If you fixed authentication: Test login/logout
- If you fixed a form: Submit the form and verify
- If you fixed the UI: Check the visual changes
- If you fixed an API: Test the endpoint with curl or Postman

### 5. Review Detailed Guides
- See **[VERIFICATION.md](VERIFICATION.md)** for step-by-step verification
- See **[TESTING.md](TESTING.md)** for comprehensive testing

## 📋 Common Verification Commands

```bash
# Backend
cd backend && npm run dev          # Start backend server
node check-database.js             # Verify database
npm run seed:crisis                # Seed test data

# Frontend  
cd frontend && npm run dev         # Start frontend server
npm run build                      # Build for production
npm run lint                       # Check code quality

# Health Checks
curl http://localhost:5080/health  # Backend health
curl http://localhost:5080/        # Backend root
```

## 🏗️ Project Structure

```
├── backend/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   ├── check-database.js  # Database verification script
│   └── server.js          # Server entry point
├── frontend/               # React frontend
│   ├── src/               # Source files
│   ├── public/            # Static assets
│   └── vite.config.js     # Vite configuration
├── VERIFICATION.md         # Verification guide
├── TESTING.md             # Testing guide
└── verify.sh              # Quick verification script
```

## 🔧 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed:crisis` - Seed crisis data

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing

See **[TESTING.md](TESTING.md)** for comprehensive testing procedures including:
- Manual testing workflows
- API testing with curl and Postman
- Frontend testing procedures
- Integration testing scenarios
- Common test cases and expected results

## 🐛 Troubleshooting

### Cannot connect to MongoDB
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port already in use
```bash
# Find and kill process using port 5080
lsof -i :5080
kill -9 <PID>
```

### Frontend not loading data
1. Check backend is running: `curl http://localhost:5080/health`
2. Check CORS settings in backend `.env`
3. Check browser console for errors
4. Verify API URL in frontend configuration

For more troubleshooting, see **[VERIFICATION.md](VERIFICATION.md)** - Common Issues section.

## 📖 Features

- User authentication (Admin, Volunteer, Affected Person roles)
- Crisis/Incident management
- Resource allocation and tracking
- Task assignment and management
- Safe zone mapping and navigation
- Real-time updates with Socket.IO
- Emergency contact management
- AI-powered chatbot assistance

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test using `./verify.sh` and guides in VERIFICATION.md
4. Submit a pull request

## 📄 License

This project is for Devthon 3.0 competition.

---

**Need Help?** Check [VERIFICATION.md](VERIFICATION.md) and [TESTING.md](TESTING.md) for detailed guides. 
