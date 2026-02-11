# API Testing Examples - SafeLanka

This file contains practical API testing examples for the SafeLanka backend.

## Base URL
```
Local Development: http://localhost:5080
```

## Table of Contents
1. [Health & Status](#health--status)
2. [Authentication](#authentication)
3. [Crisis Management](#crisis-management)
4. [Resource Management](#resource-management)
5. [Contact Availability](#contact-availability)
6. [Safe Zones](#safe-zones)
7. [Task Management](#task-management)
8. [Admin Operations](#admin-operations)

---

## Health & Status

### Check Server Health
```bash
curl -X GET http://localhost:5080/health
```

**Expected Response (200):**
```json
{
  "status": "OK",
  "database": "Connected",
  "uptime": 123.456
}
```

### Check Root Endpoint
```bash
curl -X GET http://localhost:5080/
```

**Expected Response (200):**
```json
{
  "message": "SafeLanka API Server",
  "status": "Running"
}
```

---

## Authentication

### Register New User

**Volunteer Registration:**
```bash
curl -X POST http://localhost:5080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Volunteer",
    "email": "john.volunteer@example.com",
    "password": "securepass123",
    "role": "volunteer",
    "location": "Colombo",
    "skills": {
      "firstAid": true,
      "search": true,
      "evacuation": false,
      "medical": false,
      "technical": false
    },
    "phone": "+94771234567"
  }'
```

**Admin Registration:**
```bash
curl -X POST http://localhost:5080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@safelanka.com",
    "password": "adminpass123",
    "role": "admin",
    "location": "Colombo"
  }'
```

**Affected Person Registration:**
```bash
curl -X POST http://localhost:5080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Affected",
    "email": "jane.affected@example.com",
    "password": "password123",
    "role": "affected_person",
    "location": "Galle"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Volunteer",
      "email": "john.volunteer@example.com",
      "role": "volunteer",
      "location": "Colombo"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```bash
curl -X POST http://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.volunteer@example.com",
    "password": "securepass123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Volunteer",
    "email": "john.volunteer@example.com",
    "role": "volunteer"
  }
}
```

### Get Current User Profile

```bash
# Replace YOUR_TOKEN with actual JWT token from login
curl -X GET http://localhost:5080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Volunteer",
    "email": "john.volunteer@example.com",
    "role": "volunteer",
    "location": "Colombo",
    "skills": {
      "firstAid": true,
      "search": true
    }
  }
}
```

### Logout

```bash
curl -X POST http://localhost:5080/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Crisis Management

### Get All Crises

```bash
curl -X GET http://localhost:5080/api/crisis \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Flood in Colombo",
      "description": "Severe flooding in Colombo district",
      "severity": "high",
      "status": "active",
      "type": "flood",
      "location": {
        "type": "Point",
        "coordinates": [79.8612, 6.9271]
      },
      "affectedAreas": ["Colombo", "Mount Lavinia"],
      "createdAt": "2024-03-15T10:00:00Z"
    }
  ]
}
```

### Get Single Crisis

```bash
curl -X GET http://localhost:5080/api/crisis/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Crisis (Admin Only)

```bash
curl -X POST http://localhost:5080/api/crisis \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Earthquake in Kandy",
    "description": "Magnitude 5.2 earthquake detected",
    "severity": "high",
    "type": "earthquake",
    "status": "active",
    "location": {
      "type": "Point",
      "coordinates": [80.6337, 7.2906]
    },
    "affectedAreas": ["Kandy", "Peradeniya", "Katugastota"],
    "requiredSkills": ["search", "medical", "technical"],
    "estimatedAffected": 5000
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Crisis created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Earthquake in Kandy",
    "severity": "high",
    "status": "active"
  }
}
```

### Update Crisis (Admin Only)

```bash
curl -X PUT http://localhost:5080/api/crisis/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "estimatedAffected": 3000
  }'
```

### Delete Crisis (Admin Only)

```bash
curl -X DELETE http://localhost:5080/api/crisis/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Resource Management

### Get All Resources

```bash
curl -X GET http://localhost:5080/api/resources \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Single Resource

```bash
curl -X GET http://localhost:5080/api/resources/507f1f77bcf86cd799439014 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Resource (Admin Only)

```bash
curl -X POST http://localhost:5080/api/resources \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Water Bottles",
    "type": "supply",
    "quantity": 1000,
    "unit": "bottles",
    "location": "Colombo Warehouse",
    "description": "500ml water bottles for distribution",
    "status": "available"
  }'
```

### Update Resource

```bash
curl -X PUT http://localhost:5080/api/resources/507f1f77bcf86cd799439014 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 800,
    "status": "low"
  }'
```

### Delete Resource

```bash
curl -X DELETE http://localhost:5080/api/resources/507f1f77bcf86cd799439014 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Contact Availability

### Submit Contact Availability

```bash
curl -X POST http://localhost:5080/api/contact-availability \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": {
      "date": "2024-03-20",
      "time": {
        "hour": "10",
        "minute": "30",
        "period": "AM"
      }
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Sister",
      "phone": "+94771234567"
    }
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Contact availability submitted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "availability": {
      "date": "2024-03-20T00:00:00Z",
      "time": {
        "hour": "10",
        "minute": "30",
        "period": "AM"
      }
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Sister",
      "phone": "+94771234567"
    }
  }
}
```

### Get User's Contact Availability

```bash
curl -X GET http://localhost:5080/api/contact-availability/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Contact Availability

```bash
curl -X PUT http://localhost:5080/api/contact-availability/507f1f77bcf86cd799439015 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": {
      "date": "2024-03-21",
      "time": {
        "hour": "02",
        "minute": "00",
        "period": "PM"
      }
    }
  }'
```

---

## Safe Zones

### Get All Safe Zones

```bash
curl -X GET http://localhost:5080/api/safe-zones \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Single Safe Zone

```bash
curl -X GET http://localhost:5080/api/safe-zones/507f1f77bcf86cd799439016 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Safe Zone (Admin Only)

```bash
curl -X POST http://localhost:5080/api/safe-zones \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Colombo Community Center",
    "location": {
      "type": "Point",
      "coordinates": [79.8612, 6.9271]
    },
    "address": "123 Main Street, Colombo 07",
    "capacity": 500,
    "currentOccupancy": 0,
    "amenities": ["water", "food", "medical", "shelter"],
    "contact": {
      "name": "John Manager",
      "phone": "+94112345678"
    },
    "status": "available"
  }'
```

### Find Nearest Safe Zone

```bash
curl -X GET "http://localhost:5080/api/safe-zones/nearest?lat=6.9271&lng=79.8612" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Task Management

### Get All Tasks

```bash
curl -X GET http://localhost:5080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get User's Tasks

```bash
curl -X GET http://localhost:5080/api/tasks/my-tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Task (Admin Only)

```bash
curl -X POST http://localhost:5080/api/tasks \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Distribute Water Supplies",
    "description": "Distribute water bottles in affected area",
    "crisisId": "507f1f77bcf86cd799439012",
    "priority": "high",
    "requiredSkills": ["evacuation"],
    "location": {
      "type": "Point",
      "coordinates": [79.8612, 6.9271]
    },
    "deadline": "2024-03-16T18:00:00Z"
  }'
```

### Assign Task to User (Admin Only)

```bash
curl -X POST http://localhost:5080/api/tasks/507f1f77bcf86cd799439017/assign \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011"
  }'
```

### Update Task Status

```bash
curl -X PUT http://localhost:5080/api/tasks/507f1f77bcf86cd799439017 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

---

## Admin Operations

### Get All Users (Admin Only)

```bash
curl -X GET http://localhost:5080/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get User by ID (Admin Only)

```bash
curl -X GET http://localhost:5080/api/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update User Role (Admin Only)

```bash
curl -X PUT http://localhost:5080/api/admin/users/507f1f77bcf86cd799439011/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### Delete User (Admin Only)

```bash
curl -X DELETE http://localhost:5080/api/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get System Statistics (Admin Only)

```bash
curl -X GET http://localhost:5080/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details..."
}
```

---

## Testing Tips

1. **Save your token**: After login, save the token to use in subsequent requests
2. **Use environment variables**: In Postman, create variables for `baseUrl` and `token`
3. **Test in order**: Register → Login → Get Token → Test endpoints
4. **Check status codes**: Ensure you get expected status codes (200, 201, etc.)
5. **Verify database**: After POST/PUT/DELETE, check database with `check-database.js`
6. **Test error cases**: Try invalid data to test validation
7. **Test authorization**: Try accessing admin endpoints as regular user

---

## Shell Script for Quick Testing

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5080"

# Register and login
echo "1. Registering user..."
REGISTER=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"test123","role":"volunteer"}')

echo "2. Logging in..."
LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')

TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "3. Getting profile..."
curl -s $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq

echo "4. Getting crises..."
curl -s $BASE_URL/api/crisis \
  -H "Authorization: Bearer $TOKEN" | jq
```

Run with: `chmod +x test-api.sh && ./test-api.sh`

---

**For more testing guidance, see [TESTING.md](TESTING.md)**
