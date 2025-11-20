# 🧪 Registration Testing Guide

## Quick Test Checklist

### ✅ Prerequisites
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] PostgreSQL database running
- [ ] Database tables created

---

## 🚀 Start Services

```bash
# Terminal 1: Start Backend
cd /Users/Cappie/Documents/WCREAMS/backend
npm start

# Terminal 2: Start Frontend
cd /Users/Cappie/Documents/WCREAMS/frontend
npm start
```

---

## 🧪 Test 1: Basic Registration

### Steps:
1. Open browser: `http://localhost:3000/register`
2. Fill form:
   - **Username:** `testuser1`
   - **Password:** `Test123!`
   - **Confirm Password:** `Test123!`
   - **Gender:** Select "Husband" or "Wife"
3. Click **"Sign Up"**

### Expected Result:
- ✅ No console errors
- ✅ Redirects to `/` (home/dashboard)
- ✅ User is logged in
- ✅ localStorage contains `token` and `user`

### Verify in Browser Console:
```javascript
// Check localStorage
localStorage.getItem('token')  // Should return JWT token
localStorage.getItem('user')   // Should return user JSON

// Parse user data
JSON.parse(localStorage.getItem('user'))
// Should show: { id, username, gender, isAdmin, role, ... }
```

---

## 🧪 Test 2: Duplicate Username

### Steps:
1. Try to register again with same username: `testuser1`
2. Click **"Sign Up"**

### Expected Result:
- ✅ Shows error: "Username already exists"
- ✅ Form stays on registration page
- ✅ No redirect

---

## 🧪 Test 3: Password Validation

### Test 3.1: Short Password
- **Password:** `abc`
- **Expected:** "Password is too weak" error

### Test 3.2: Mismatched Passwords
- **Password:** `Test123!`
- **Confirm:** `Test456!`
- **Expected:** "Passwords do not match" error

### Test 3.3: Password Strength Indicator
- Type `abc` → Shows "Very Weak" (red)
- Type `Abc123` → Shows "Medium" (blue)
- Type `Abc123!` → Shows "Strong" (green)

---

## 🧪 Test 4: Empty Fields

### Steps:
1. Leave username empty
2. Click **"Sign Up"**

### Expected Result:
- ✅ Browser shows "Please fill out this field"
- ✅ Form doesn't submit

---

## 🧪 Test 5: Backend API Direct Test

### Using cURL:

```bash
# Test successful registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apitest1",
    "password": "password123",
    "gender": "male"
  }'

# Expected Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": 2,
#     "username": "apitest1",
#     "gender": "male",
#     "isAdmin": false
#   }
# }
```

### Test Error Cases:

```bash
# Missing fields
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test"}'

# Expected: {"error": "All fields are required"}

# Short password
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test2",
    "password": "abc",
    "gender": "male"
  }'

# Expected: {"error": "Password must be at least 6 characters long"}

# Duplicate username
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apitest1",
    "password": "password123",
    "gender": "male"
  }'

# Expected: {"error": "Username already exists"}
```

---

## 🧪 Test 6: Database Verification

### Check if user was created:

```bash
# Connect to PostgreSQL
psql -U postgres -d wcreams

# Query users table
SELECT id, username, gender, is_admin, created_at FROM users;

# Expected output:
#  id | username  | gender | is_admin |       created_at
# ----+-----------+--------+----------+------------------------
#   1 | admin     | male   | t        | 2024-01-01 00:00:00
#   2 | testuser1 | male   | f        | 2025-10-10 15:50:00
#   3 | apitest1  | male   | f        | 2025-10-10 15:51:00
```

---

## 🧪 Test 7: Login After Registration

### Steps:
1. After successful registration, you should be auto-logged in
2. Navigate to `/login`
3. Try logging in with the new credentials:
   - **Username:** `testuser1`
   - **Password:** `Test123!`
4. Click **"Sign In"**

### Expected Result:
- ✅ Successful login
- ✅ Redirects to dashboard
- ✅ User data loaded

---

## 🧪 Test 8: Logout and Re-login

### Steps:
1. Click logout button (if available in UI)
2. Or manually clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Navigate to `/login`
4. Login with registered user
5. Should work successfully

---

## 🧪 Test 9: Network Tab Inspection

### Steps:
1. Open Chrome DevTools → Network tab
2. Fill registration form
3. Click "Sign Up"
4. Look for POST request to `/api/auth/register`

### Verify:
- **Request URL:** `http://localhost:5000/api/auth/register`
- **Method:** POST
- **Status:** 201 Created
- **Request Payload:**
  ```json
  {
    "username": "testuser1",
    "password": "Test123!",
    "gender": "male"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJ...",
    "user": { ... }
  }
  ```

---

## 🧪 Test 10: Console Error Check

### Steps:
1. Open browser console (F12)
2. Go through registration flow
3. Check for errors

### Expected:
- ✅ No red errors
- ✅ May see logs like "Registration successful"
- ✅ No "register is not a function" error

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot POST /api/auth/register"
**Solution:** Backend not running. Start with `npm start` in backend folder.

### Issue: "Network Error"
**Solution:** Check if backend is on port 5000:
```bash
lsof -i :5000
```

### Issue: "Database connection error"
**Solution:** Start PostgreSQL:
```bash
# macOS
brew services start postgresql

# Check connection
psql -U postgres -l
```

### Issue: "register is not a function"
**Solution:** ✅ Already fixed! Refresh browser to clear cache.

### Issue: "Password is too weak" won't go away
**Solution:** Ensure password has:
- At least 6 characters
- Mix of uppercase, lowercase, numbers, or special chars

---

## ✅ Success Criteria

All tests pass if:
- ✅ Can register new user
- ✅ User stored in database
- ✅ JWT token generated
- ✅ Auto-login works
- ✅ Validation errors show correctly
- ✅ Duplicate username rejected
- ✅ Can login with registered credentials
- ✅ No console errors

---

## 📊 Test Results Template

```
Date: 2025-10-10
Tester: [Your Name]

Test 1: Basic Registration          [ PASS / FAIL ]
Test 2: Duplicate Username          [ PASS / FAIL ]
Test 3: Password Validation         [ PASS / FAIL ]
Test 4: Empty Fields                [ PASS / FAIL ]
Test 5: Backend API                 [ PASS / FAIL ]
Test 6: Database Verification       [ PASS / FAIL ]
Test 7: Login After Registration    [ PASS / FAIL ]
Test 8: Logout and Re-login         [ PASS / FAIL ]
Test 9: Network Tab                 [ PASS / FAIL ]
Test 10: Console Errors             [ PASS / FAIL ]

Overall Status: [ PASS / FAIL ]
Notes: ___________________________
```

---

**Happy Testing! 🎉**
