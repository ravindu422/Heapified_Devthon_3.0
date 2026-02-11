# Quick Reference - SafeLanka

This is a quick reference guide for common tasks and verification steps.

## 🚀 Quick Start Commands

```bash
# From project root
./verify.sh                    # Run full verification
npm run verify                 # Alternative way to verify
npm run check-db               # Check database contents
npm run dev:backend            # Start backend server
npm run dev:frontend           # Start frontend server
```

## ✅ After Making a Fix - Checklist

Use this checklist after making any code changes:

```
□ Code compiles/builds without errors
□ Linting passes (npm run lint)
□ Backend server starts successfully
□ Frontend server starts successfully
□ Database connects properly
□ Specific feature/fix works as expected
□ No new console errors
□ Related tests pass (if applicable)
□ Documentation updated (if needed)
```

## 🔍 Quick Verification Methods

### Method 1: Automated Script (Recommended)
```bash
./verify.sh
```

### Method 2: Manual Health Checks
```bash
# Backend health
curl http://localhost:5080/health

# Database check
cd backend && node check-database.js

# Frontend (open in browser)
open http://localhost:5173
```

### Method 3: Using npm scripts
```bash
npm run health        # Check backend health
npm run check-db      # Check database
```

## 🐛 Quick Troubleshooting

### Backend won't start
```bash
# Check if port is in use
lsof -i :5080

# Check MongoDB is running
sudo systemctl status mongod

# Check .env file exists
ls backend/.env
```

### Frontend won't start
```bash
# Check if port is in use
lsof -i :5173

# Reinstall dependencies
cd frontend && rm -rf node_modules && npm install

# Check for errors
cd frontend && npm run dev
```

### Database connection fails
```bash
# Start MongoDB
sudo systemctl start mongod

# Check connection string
cat backend/.env | grep MONGODB_URI

# Test connection
cd backend && node check-database.js
```

## 📋 Common API Endpoints

```bash
# Health check
GET http://localhost:5080/health

# Root endpoint
GET http://localhost:5080/

# Register user
POST http://localhost:5080/api/auth/register

# Login
POST http://localhost:5080/api/auth/login

# Get crises
GET http://localhost:5080/api/crisis

# Get resources
GET http://localhost:5080/api/resources

# Get safe zones
GET http://localhost:5080/api/safe-zones
```

## 🧪 Quick Test Examples

### Test User Registration
```bash
curl -X POST http://localhost:5080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"test1234","role":"volunteer"}'
```

### Test Login
```bash
curl -X POST http://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

### Test Protected Endpoint
```bash
# First login to get token, then:
curl -X GET http://localhost:5080/api/crisis \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📂 Important Files

```
/verify.sh                    # Main verification script
/VERIFICATION.md              # Full verification guide
/TESTING.md                   # Complete testing guide
/backend/.env.example         # Backend environment template
/backend/check-database.js    # Database verification script
/frontend/.env.example        # Frontend environment template
```

## 🔑 Key Environment Variables

### Backend (.env)
```
PORT=5080
MONGODB_URI=mongodb://localhost:27017/safelanka
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5080
VITE_SOCKET_URL=http://localhost:5080
```

## 🎯 Feature-Specific Verification

### After Auth Fix
1. Test registration endpoint
2. Test login endpoint
3. Verify JWT token generation
4. Test protected routes
5. Check user in database

### After UI Fix
1. Start frontend server
2. Open browser DevTools
3. Navigate to affected page
4. Verify visual changes
5. Check console for errors
6. Test responsive design

### After API Fix
1. Start backend server
2. Test endpoint with curl
3. Check response status code
4. Verify response data format
5. Check database if data changes

### After Database Fix
1. Run check-database.js
2. Verify collections exist
3. Check data integrity
4. Test CRUD operations
5. Verify relationships

## 📞 Getting Help

If verification fails:

1. Check error messages carefully
2. Review logs (console output)
3. Check VERIFICATION.md for detailed steps
4. Check TESTING.md for test procedures
5. Review recent commits
6. Ask team members

## 💡 Tips

- Always verify before committing
- Test in clean browser (incognito mode)
- Clear cache if UI doesn't update
- Check both frontend and backend logs
- Use browser DevTools Network tab
- Test with different user roles
- Verify on different browsers

---

**For detailed information, see:**
- [VERIFICATION.md](VERIFICATION.md) - Complete verification guide
- [TESTING.md](TESTING.md) - Comprehensive testing guide
- [README.md](README.md) - Project documentation
