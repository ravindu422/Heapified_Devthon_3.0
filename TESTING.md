# Testing Guide - SafeLanka Project

This guide provides comprehensive testing procedures for the SafeLanka crisis management application.

## Table of Contents
1. [Testing Strategy](#testing-strategy)
2. [Manual Testing](#manual-testing)
3. [API Testing](#api-testing)
4. [Frontend Testing](#frontend-testing)
5. [Integration Testing](#integration-testing)
6. [Test Scenarios](#test-scenarios)

---

## Testing Strategy

### Test Pyramid
```
        /\
       /UI\         - End-to-end tests (Manual)
      /----\
     /  API \       - API/Integration tests
    /--------\
   /  Unit    \     - Unit tests (Future)
  /------------\
```

### Testing Levels

1. **Manual Testing** - User interface and workflows
2. **API Testing** - Backend endpoints
3. **Integration Testing** - Database + API + Frontend
4. **Smoke Testing** - Quick health checks

---

## Manual Testing

### Pre-requisites

1. Backend server running on `http://localhost:5080`
2. Frontend server running on `http://localhost:5173`
3. MongoDB running and accessible
4. Test user accounts created

### User Registration Flow

**Steps:**
1. Navigate to registration page
2. Fill in the form:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Role: Select "Volunteer"
   - Location: "Colombo"
   - Skills: Check "First Aid" and "Search & Rescue"
3. Submit the form
4. Verify success message appears
5. Check database: `node backend/check-database.js`

**Expected Result:**
- ✅ Success notification
- ✅ Redirect to dashboard/login
- ✅ User appears in database
- ✅ Password is hashed (not plain text)

### User Login Flow

**Steps:**
1. Navigate to login page
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "password123"
3. Click login
4. Verify dashboard loads

**Expected Result:**
- ✅ JWT token stored in localStorage/cookie
- ✅ User redirected to dashboard
- ✅ User information displayed correctly
- ✅ Navigation shows user-specific options

### Crisis Management Testing

#### Viewing Crises
**Steps:**
1. Login as any user
2. Navigate to crisis/incidents page
3. View list of active crises

**Expected Result:**
- ✅ Crises displayed in cards/list
- ✅ Shows title, severity, location
- ✅ Map shows crisis locations
- ✅ Can filter by severity/status

#### Creating Crisis (Admin Only)
**Steps:**
1. Login as admin user
2. Navigate to "Create Crisis" page
3. Fill in form:
   - Title: "Test Flood"
   - Description: "Test flood in Colombo"
   - Severity: "High"
   - Location: Click on map or enter coordinates
   - Type: "Flood"
4. Submit

**Expected Result:**
- ✅ Crisis created successfully
- ✅ Appears in crisis list
- ✅ Shows on map
- ✅ Other users can see it

### Resource Management Testing

**Steps:**
1. Navigate to resources page
2. View available resources
3. (Admin) Add new resource
4. (Volunteer) Request resource
5. Verify resource allocation

**Expected Result:**
- ✅ Resources listed correctly
- ✅ Can filter/search resources
- ✅ Request system works
- ✅ Quantities update correctly

### Contact Availability Testing

**Steps:**
1. Login as volunteer
2. Navigate to contact availability form
3. Fill in:
   - Availability date: Tomorrow
   - Availability time: 10:00 AM
   - Emergency contact details
4. Submit

**Expected Result:**
- ✅ Form saves successfully
- ✅ Data appears in database
- ✅ Can view/edit availability

### Safe Zone Testing

**Steps:**
1. View safe zones on map
2. Search for nearest safe zone
3. Get directions to safe zone

**Expected Result:**
- ✅ Safe zones marked on map
- ✅ Click for details
- ✅ Shows capacity, amenities
- ✅ Distance calculation works

---

## API Testing

### Using curl

Create a file `api-tests.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5080"
TOKEN=""

echo "=== SafeLanka API Tests ==="

# 1. Health Check
echo -e "\n1. Health Check"
curl -s $BASE_URL/health | jq

# 2. Register User
echo -e "\n2. Register User"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "API Test User",
    "email": "apitest@example.com",
    "password": "test1234",
    "role": "volunteer",
    "location": "Colombo"
  }')
echo $REGISTER_RESPONSE | jq

# 3. Login
echo -e "\n3. Login"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "test1234"
  }')
echo $LOGIN_RESPONSE | jq

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // .data.token // empty')

if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  exit 1
fi

echo "Token: $TOKEN"

# 4. Get User Profile
echo -e "\n4. Get User Profile"
curl -s $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq

# 5. Get Crises
echo -e "\n5. Get Crises"
curl -s $BASE_URL/api/crisis \
  -H "Authorization: Bearer $TOKEN" | jq

# 6. Get Resources
echo -e "\n6. Get Resources"
curl -s $BASE_URL/api/resources \
  -H "Authorization: Bearer $TOKEN" | jq

# 7. Get Safe Zones
echo -e "\n7. Get Safe Zones"
curl -s $BASE_URL/api/safe-zones \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\n=== Tests Complete ==="
```

Run with:
```bash
chmod +x api-tests.sh
./api-tests.sh
```

### Using Postman

1. Import collection (if available)
2. Set environment variables:
   - `baseUrl`: `http://localhost:5080`
   - `token`: (obtained from login)
3. Run collection tests

### API Test Cases

#### Authentication

| Test Case | Method | Endpoint | Expected Status |
|-----------|--------|----------|-----------------|
| Register new user | POST | /api/auth/register | 201 |
| Register duplicate email | POST | /api/auth/register | 400 |
| Login valid credentials | POST | /api/auth/login | 200 |
| Login invalid password | POST | /api/auth/login | 401 |
| Get profile with token | GET | /api/auth/me | 200 |
| Get profile without token | GET | /api/auth/me | 401 |

#### Crisis Management

| Test Case | Method | Endpoint | Expected Status |
|-----------|--------|----------|-----------------|
| Get all crises | GET | /api/crisis | 200 |
| Get crisis by ID | GET | /api/crisis/:id | 200 |
| Create crisis (admin) | POST | /api/crisis | 201 |
| Create crisis (non-admin) | POST | /api/crisis | 403 |
| Update crisis | PUT | /api/crisis/:id | 200 |
| Delete crisis | DELETE | /api/crisis/:id | 200 |

#### Resources

| Test Case | Method | Endpoint | Expected Status |
|-----------|--------|----------|-----------------|
| Get all resources | GET | /api/resources | 200 |
| Get resource by ID | GET | /api/resources/:id | 200 |
| Create resource | POST | /api/resources | 201 |
| Update resource | PUT | /api/resources/:id | 200 |
| Delete resource | DELETE | /api/resources/:id | 200 |

---

## Frontend Testing

### Browser Compatibility

Test on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)

### Responsive Design Testing

Test on different viewport sizes:
- Desktop: 1920x1080
- Laptop: 1366x768
- Tablet: 768x1024
- Mobile: 375x667

Use browser DevTools device emulation.

### Accessibility Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Press Enter to activate buttons
   - Test form submission with keyboard

2. **Screen Reader** (Optional)
   - Use NVDA (Windows) or VoiceOver (Mac)
   - Verify alt text on images
   - Check form labels

3. **Color Contrast**
   - Use browser DevTools
   - Check text is readable
   - Verify focus indicators

### Performance Testing

1. Open DevTools > Lighthouse
2. Run audit
3. Check scores:
   - Performance > 80
   - Accessibility > 90
   - Best Practices > 80
   - SEO > 80

---

## Integration Testing

### End-to-End User Scenarios

#### Scenario 1: Volunteer Responds to Crisis

1. **Setup:** Crisis exists in database
2. **Actions:**
   - Volunteer logs in
   - Views crisis list
   - Selects a crisis
   - Volunteers for a task
   - Updates task status
3. **Verify:**
   - Task assigned to volunteer
   - Status updates in real-time
   - Notifications sent
   - Database reflects changes

#### Scenario 2: Admin Creates and Manages Crisis

1. **Setup:** Admin logged in
2. **Actions:**
   - Create new crisis
   - Add resources to crisis
   - Assign tasks
   - Update crisis status
   - Close crisis
3. **Verify:**
   - All changes persist
   - Volunteers can see updates
   - Map updates correctly
   - Audit trail exists

#### Scenario 3: Resource Allocation

1. **Setup:** Resources and crises exist
2. **Actions:**
   - Request resource for crisis
   - Approve/reject request
   - Allocate resource
   - Track resource usage
3. **Verify:**
   - Quantities update
   - History tracked
   - Notifications work

---

## Test Scenarios

### Critical Path Tests

These must always work:

1. ✅ User can register
2. ✅ User can login
3. ✅ User can view crises
4. ✅ Admin can create crisis
5. ✅ Volunteer can view tasks
6. ✅ User can view safe zones
7. ✅ Real-time updates work (Socket.IO)

### Regression Tests

After any change, test:

1. Login still works
2. API endpoints return correct data
3. Maps load correctly
4. Forms submit successfully
5. Navigation works
6. Logout works

### Security Tests

1. **Authentication:**
   - Cannot access protected routes without token
   - Token expires correctly
   - Logout invalidates token

2. **Authorization:**
   - Regular users cannot access admin endpoints
   - Users can only edit their own data
   - Proper error messages (don't leak info)

3. **Input Validation:**
   - SQL injection attempts fail
   - XSS attempts sanitized
   - File upload restrictions work
   - Rate limiting active

### Error Handling Tests

1. **Network Errors:**
   - Disconnect internet
   - Verify error messages
   - Check retry logic

2. **Server Errors:**
   - Stop backend
   - Verify frontend handles gracefully
   - Check error messages

3. **Invalid Input:**
   - Submit empty forms
   - Enter invalid emails
   - Try wrong data types
   - Check validation messages

---

## Test Data

### Sample Users

```json
{
  "admin": {
    "email": "admin@safelanka.com",
    "password": "admin123",
    "role": "admin"
  },
  "volunteer": {
    "email": "volunteer@example.com",
    "password": "volunteer123",
    "role": "volunteer"
  },
  "affected": {
    "email": "affected@example.com",
    "password": "affected123",
    "role": "affected_person"
  }
}
```

### Sample Crisis

```json
{
  "title": "Flood in Colombo",
  "description": "Heavy flooding in Colombo district",
  "severity": "high",
  "type": "flood",
  "status": "active",
  "location": {
    "type": "Point",
    "coordinates": [79.8612, 6.9271]
  },
  "affectedAreas": ["Colombo", "Mount Lavinia"],
  "requiredSkills": ["firstAid", "search", "evacuation"]
}
```

---

## Automated Testing (Future)

### Unit Tests (To Be Implemented)

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Test Coverage

Aim for:
- Unit tests: 70%+
- Integration tests: 50%+
- E2E tests: Critical paths

---

## Continuous Integration

### GitHub Actions Workflow (Future)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linter
        run: npm run lint
```

---

## Troubleshooting Tests

### Tests Fail Intermittently

- Check for timing issues
- Increase timeouts
- Check external dependencies
- Verify test data state

### Database Tests Fail

- Clear database between tests
- Use test database, not production
- Check connection string
- Verify seeded data exists

### API Tests Return 401

- Check token generation
- Verify token hasn't expired
- Check Authorization header format
- Ensure user exists in database

---

## Best Practices

1. **Test Early, Test Often** - Don't wait until the end
2. **Isolate Tests** - Each test should be independent
3. **Use Realistic Data** - Test with production-like data
4. **Document Test Cases** - Write clear test descriptions
5. **Automate When Possible** - Manual tests for UI, automate APIs
6. **Test Edge Cases** - Empty data, max values, special characters
7. **Clean Up** - Remove test data after tests

---

## Quick Test Commands

```bash
# Backend health
curl http://localhost:5080/health

# Frontend check (in browser)
open http://localhost:5173

# Database check
node backend/check-database.js

# Lint check
cd backend && npm run lint (if available)
cd frontend && npm run lint

# Build test
cd frontend && npm run build
```

---

**Last Updated:** 2026-02-11
