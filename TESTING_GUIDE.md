# Quick Testing Guide for Postman

## Step-by-Step Instructions

### 1. Import Postman Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select **Postman_Collection.json** from your project folder
4. All 8 API requests will be imported automatically ✅

### 2. Start Backend Server
```bash
cd Backend
npm start
```
✅ Server should be running on: **http://localhost:1313**

### 3. Test APIs in Order (Recommended)

#### Feature 1: AI Waste Assistant

**API 1.1: Ask AI Assistant** ⭐ START HERE
- Method: POST
- URL: `http://localhost:1313/api/suraiya/ai-assistant/ask`
- Body (already filled in):
  ```json
  {
    "userId": "suraiya_test_user_1",
    "question": "How do I recycle plastic bottles?",
    "sessionId": "session_123"
  }
  ```
- Expected Response: 200 OK with AI answer
- **📸 Screenshot Tip:** Capture the entire Postman window showing request + response

**API 1.2: Get User History**
- Method: GET
- URL: `http://localhost:1313/api/suraiya/ai-assistant/history/suraiya_test_user_1?page=1&limit=10`
- Body: None
- Expected Response: 200 OK with conversation history
- **📸 Screenshot Tip:** Show the full response with pagination

**API 1.3: Submit Feedback**
- Method: PATCH
- URL: `http://localhost:1313/api/suraiya/ai-assistant/feedback/:conversationId`
- ⚠️ **IMPORTANT:** Replace `:conversationId` with actual ID from API 1.1 response
  - Copy the `"id"` field from Ask AI Assistant response
  - Example: `69ae59a03feafaa54ee27ec3`
- Body:
  ```json
  {
    "isHelpful": true
  }
  ```
- Expected Response: 200 OK with feedback confirmation
- **📸 Screenshot Tip:** Show the conversationId in URL and response

---

#### Feature 2: User Profile Management

**API 2.1: Create User Profile** ⭐ START HERE
- Method: POST
- URL: `http://localhost:1313/api/profile`
- Body (already filled in):
  ```json
  {
    "name": "Test User",
    "email": "testuser@example.com",
    "phone": "+880 1234567890",
    "location": "Dhaka, Bangladesh",
    "bio": "New eco-conscious user!"
  }
  ```
- Expected Response: 201 Created with new user data
- ⚠️ **SAVE THE USER ID** from response for next APIs!
- **📸 Screenshot Tip:** Capture 201 status and full user object

**API 2.2: Get User Profile**
- Method: GET
- URL: `http://localhost:1313/api/profile/:userId`
- ⚠️ **IMPORTANT:** Replace `:userId` with ID from Create Profile response
- Body: None
- Expected Response: 200 OK with user profile data
- **📸 Screenshot Tip:** Show user ID in URL and matching response

**API 2.3: Update User Profile**
- Method: PUT
- URL: `http://localhost:1313/api/profile/:userId`
- ⚠️ **IMPORTANT:** Replace `:userId` with same user ID
- Body:
  ```json
  {
    "name": "Updated Name",
    "phone": "+880 9876543210",
    "location": "Chittagong, Bangladesh",
    "bio": "Environmental activist passionate about sustainable living."
  }
  ```
- Expected Response: 200 OK with updated user data
- **📸 Screenshot Tip:** Show the updated fields in response

---

### 4. Screenshot Checklist

For EACH API, your screenshot should show:
- ✅ HTTP Method (GET/POST/PUT/PATCH)
- ✅ Full URL with port 1313
- ✅ Headers tab (if Content-Type: application/json is set)
- ✅ Body tab (for POST/PUT/PATCH requests)
- ✅ Response Status Code (200, 201, etc.)
- ✅ Response Body (formatted JSON)

**Pro Tip:** In Postman, you can click the full-screen icon to make screenshots clearer!

---

### 5. Common Issues & Solutions

**❌ Error: "Cannot connect to backend"**
- ✅ Make sure backend is running: `npm start` in Backend folder
- ✅ Check console shows: "Server listening on port 1313"

**❌ Error: "User not found" (API 2.2, 2.3)**
- ✅ Make sure you created a profile first (API 2.1)
- ✅ Copy the correct `_id` from the Create Profile response
- ✅ Replace `:userId` in the URL with the actual ID

**❌ Error: "Conversation not found" (API 1.3)**
- ✅ Make sure you asked a question first (API 1.1)
- ✅ Copy the correct `id` from the Ask AI response
- ✅ Replace `:conversationId` in the URL with the actual ID

**❌ Error: "User with this email already exists" (API 2.1)**
- ✅ Change the email in request body to a different one
- ✅ Example: `testuser2@example.com`, `testuser3@example.com`

---

### 6. Quick Test Order (5 Minutes)

1. **Start Backend** → `cd Backend && npm start`
2. **Import Collection** → Import Postman_Collection.json
3. **Test AI API** → Send "Ask AI Assistant" → Screenshot
4. **Create Profile** → Send "Create User Profile" → Save user ID → Screenshot
5. **Get Profile** → Replace :userId → Send → Screenshot
6. **Update Profile** → Replace :userId → Send → Screenshot
7. **Get History** → Send "Get User History" → Screenshot
8. **Submit Feedback** → Replace :conversationId → Send → Screenshot

---

### 7. Assignment Submission Format

Create a document with:

**For Each API:**
```
API 1.1: Ask AI Assistant
-------------------------
Endpoint URL: http://localhost:1313/api/suraiya/ai-assistant/ask
HTTP Method: POST
Headers: Content-Type: application/json
Body: 
{
  "userId": "suraiya_test_user_1",
  "question": "How do I recycle plastic bottles?",
  "sessionId": "session_123"
}

Code Snippet:
[Paste code from API_DOCUMENTATION.md]

Screenshot:
[Insert Postman screenshot showing request + response]
```

Repeat for all 6 APIs (3 for AI Assistant + 3 for Profile Management)

---

### 8. Extra Credit - BONUS APIs (Optional)

If you want extra points, test these admin APIs too:

**API 3.1: Get All AI Logs (Admin)**
- Already configured in Postman collection
- Shows all user conversations for admin monitoring

**API 3.2: Get Analytics (Admin)**
- Shows statistics: total conversations, category breakdown, feedback stats

---

## Need Help?

**All documentation is in:** `API_DOCUMENTATION.md`
**All code snippets are in:** Controller files in Backend/suraiya folder
**Postman collection is in:** `Postman_Collection.json`

**Backend running check:**
```bash
# Should return: {"success":true,"message":"Porichhonno backend is running"}
curl http://localhost:1313/
```

**Good luck! 🚀**
