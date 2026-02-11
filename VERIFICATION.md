# Verification Guide - SafeLanka Project

This guide explains how to verify fixes and check if the application is working correctly after making changes.

## Table of Contents
1. [Quick Verification Checklist](#quick-verification-checklist)
2. [Backend Verification](#backend-verification)
3. [Frontend Verification](#frontend-verification)
4. [Database Verification](#database-verification)
5. [API Endpoint Testing](#api-endpoint-testing)
6. [Common Issues and Solutions](#common-issues-and-solutions)

---

## Quick Verification Checklist

After making any fix, follow this checklist:

- [ ] Check if the code builds without errors
- [ ] Verify linting passes
- [ ] Test the specific feature you fixed
- [ ] Check the database connectivity
- [ ] Test related API endpoints
- [ ] Verify the UI displays correctly (if frontend changes)
- [ ] Check browser console for errors
- [ ] Review server logs for errors

---

## Backend Verification

### 1. Start the Backend Server

```bash
cd backend
npm install  # Run this if dependencies were updated
npm run dev  # For development with auto-reload
# OR
npm start    # For production mode
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ server running on port 5080
```

### 2. Check Server Health

Open your browser or use curl:
```bash
# Check if server is running
curl http://localhost:5080/

# Check health endpoint
curl http://localhost:5080/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "database": "Connected",
  "uptime": 123.456
}
```

### 3. Check Server Logs

Look for these indicators in the console:
- ✅ Green checkmarks indicate successful operations
- ❌ Red X marks indicate errors
- ⚠️ Warning symbols need attention

### 4. Test API Endpoints

Use the verification scripts in the Testing section below, or use tools like:
- **Postman** - GUI for API testing
- **curl** - Command-line testing
- **Thunder Client** - VS Code extension

---

## Frontend Verification

### 1. Start the Frontend Development Server

```bash
cd frontend
npm install  # Run this if dependencies were updated
npm run dev  # Start development server
```

**Expected Output:**
```
VITE v7.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2. Open the Application

Visit `http://localhost:5173/` in your browser

### 3. Check Browser Console

Open Developer Tools (F12) and check:
- **Console Tab** - Should have no red errors
- **Network Tab** - API calls should return 200/201 status codes
- **Application Tab** - Check localStorage/cookies if using authentication

### 4. Visual Verification

For UI fixes:
1. Open the page/component you changed
2. Verify the fix is visible
3. Test user interactions (clicks, form submissions, etc.)
4. Check responsive design (resize browser window)
5. Test on different browsers if possible

### 5. Run Linter

```bash
cd frontend
npm run lint
```

Fix any linting errors that appear.

---

## Database Verification

### 1. Using the Check Database Script

The project includes a built-in database verification script:

```bash
cd backend
node check-database.js
```

**What it checks:**
- ✅ MongoDB connection
- 📋 Users collection (count and sample data)
- 📞 Contact Availability collection
- Displays user details, skills, and emergency contacts

**Sample Output:**
```
✅ Connected to MongoDB

📋 Users collection: 3 documents
  1. John Doe (john@example.com) - Role: volunteer
     Location: Colombo
     Skills: firstAid, search

📞 Contact Availability collection: 2 documents
  1. User ID: 507f1f77bcf86cd799439011
     Availability: 2024-03-15 at 10:30 AM
     Emergency Contact: Jane Doe (Sister) - +94771234567

🔌 Database connection closed
```

### 2. Using MongoDB Compass

1. Install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your `MONGODB_URI` from `.env`
3. Navigate to the `safelanka` database
4. Verify collections: `users`, `contactavailabilities`, `crises`, etc.

### 3. Using MongoDB Shell

```bash
mongosh "mongodb://localhost:27017/safelanka"

# Show all collections
show collections

# Count documents
db.users.count()
db.contactavailabilities.count()

# View sample documents
db.users.findOne()
db.contactavailabilities.findOne()
```

---

## API Endpoint Testing

### Health Check Endpoints

```bash
# Root endpoint
curl http://localhost:5080/

# Health status
curl http://localhost:5080/health
```

### Authentication Endpoints

```bash
# Register a new user
curl -X POST http://localhost:5080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "volunteer"
  }'

# Login
curl -X POST http://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Crisis Management Endpoints

```bash
# Get all crises (requires authentication)
curl -X GET http://localhost:5080/api/crisis \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create a crisis (admin only)
curl -X POST http://localhost:5080/api/crisis \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Crisis",
    "description": "Test description",
    "severity": "high",
    "location": {
      "type": "Point",
      "coordinates": [79.8612, 6.9271]
    }
  }'
```

### Resource Management Endpoints

```bash
# Get all resources
curl -X GET http://localhost:5080/api/resources

# Get specific resource
curl -X GET http://localhost:5080/api/resources/:resourceId
```

---

## Common Issues and Solutions

### Issue: Cannot Connect to MongoDB

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running: `sudo systemctl status mongod`
2. Start MongoDB: `sudo systemctl start mongod`
3. Check `.env` file has correct `MONGODB_URI`
4. If using MongoDB Atlas, check your IP whitelist

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5080`

**Solution:**
```bash
# Find process using the port
lsof -i :5080
# OR
netstat -ano | grep :5080

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5081
```

### Issue: CORS Errors in Browser

**Error:** `Access-Control-Allow-Origin header is missing`

**Solution:**
1. Check `ALLOWED_ORIGINS` in backend `.env`
2. Ensure it includes your frontend URL: `http://localhost:5173`
3. Restart the backend server

### Issue: JWT Token Invalid

**Error:** `401 Unauthorized` or `JsonWebTokenError`

**Solution:**
1. Check `JWT_SECRET` is set in `.env`
2. Verify token hasn't expired
3. Re-login to get a fresh token
4. Check Authorization header format: `Bearer <token>`

### Issue: Frontend Not Loading API Data

**Solution:**
1. Check browser console for errors
2. Verify backend is running on correct port
3. Check API base URL in frontend configuration
4. Verify CORS is properly configured
5. Check network tab for failed requests

### Issue: Database Shows No Data

**Solution:**
1. Run the database check script: `node backend/check-database.js`
2. If empty, seed the database: `npm run seed:crisis`
3. Register a test user through the UI or API
4. Verify MongoDB connection string is correct

---

## Best Practices for Verification

1. **Always check both frontend and backend** - Many issues span both layers
2. **Use browser DevTools** - Console, Network, and Application tabs are your friends
3. **Check logs thoroughly** - Don't ignore warnings
4. **Test edge cases** - Empty inputs, invalid data, etc.
5. **Verify on clean state** - Clear cache/cookies/localStorage if needed
6. **Test different user roles** - Admin, volunteer, affected person
7. **Document your findings** - Note what works and what doesn't

---

## Getting Help

If verification fails and you can't resolve the issue:

1. Check the error message carefully
2. Search for the error in GitHub issues
3. Review recent commits for related changes
4. Ask team members for help
5. Create a detailed issue report with:
   - What you were trying to verify
   - Steps to reproduce
   - Error messages and logs
   - Your environment (OS, Node version, etc.)

---

## Quick Reference Commands

```bash
# Backend
cd backend && npm run dev          # Start backend server
node check-database.js             # Check database
npm run seed:crisis                # Seed crisis data

# Frontend  
cd frontend && npm run dev         # Start frontend server
npm run build                      # Build for production
npm run lint                       # Check code quality

# Database
mongosh "mongodb://localhost:27017/safelanka"  # Connect to MongoDB

# Testing
curl http://localhost:5080/health  # Check backend health
curl http://localhost:5173/        # Check frontend (will fail, use browser)
```

---

**Last Updated:** 2026-02-11
