# REST API Documentation - Porichhonno Project

**Student ID Last 4 Digits:** 1313  
**Backend Server:** http://localhost:1313  
**Database:** MongoDB (Atlas)

---

## Feature 1: AI Waste Assistant

### API 1.1: Ask AI Assistant
**Description:** User asks a question about waste sorting and receives AI-powered response

**Endpoint URL:** `http://localhost:1313/api/suraiya/ai-assistant/ask`

**HTTP Method:** `POST`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "userId": "suraiya_test_user_1",
  "question": "How do I recycle plastic bottles?",
  "sessionId": "optional_session_id_here"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "69ae59a03feafaa54ee27ec3",
    "question": "How do I recycle plastic bottles?",
    "answer": "♻️ Great question! Clean your plastic bottles thoroughly, remove caps and labels, and place them in the recyclable bin. Dry bottles recycle better and prevent contamination.",
    "category": "recyclable",
    "timestamp": "2026-03-09T05:24:48.181Z",
    "isMock": true,
    "provider": "gemini"
  }
}
```

**Code Snippet (Controller):**
```javascript
// File: Backend/suraiya/user/suraiya_ai_assistant/suraiya_ai.controller.js
export const askAiAssistant = async (req, res) => {
  const { question, userId, sessionId } = req.body || {};
  
  try {
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
      });
    }

    const provider = getAIProvider();
    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${question}`;
    const result = await generateWithProviderFallback(provider, prompt, question);
    const aiResponse = result.text;
    
    const wasteCategory = detectWasteCategory(question);
    const responseTime = Date.now() - startTime;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const assistantLog = await SuraiyaAiAssistant.create({
      userId: userId || 'suraiya_test_user_1',
      userQuestion: question.trim(),
      aiResponse,
      wasteCategory,
      sessionId: sessionId || null,
      ipAddress,
      responseTime,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: assistantLog._id,
        question: assistantLog.userQuestion,
        answer: assistantLog.aiResponse,
        category: assistantLog.wasteCategory,
        timestamp: assistantLog.createdAt,
        isMock: isMockResponse,
        provider,
      },
    });
  } catch (error) {
    console.error('AI Assistant Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
```

---

### API 1.2: Get User Conversation History
**Description:** Retrieve all past conversations for a specific user

**Endpoint URL:** `http://localhost:1313/api/suraiya/ai-assistant/history/suraiya_test_user_1`

**HTTP Method:** `GET`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example URL with params:** `http://localhost:1313/api/suraiya/ai-assistant/history/suraiya_test_user_1?page=1&limit=10`

**Request Body:** None

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "69ae59a03feafaa54ee27ec3",
        "userId": "suraiya_test_user_1",
        "userQuestion": "How do I recycle plastic bottles?",
        "aiResponse": "♻️ Great question! Clean your plastic bottles...",
        "wasteCategory": "recyclable",
        "isHelpful": null,
        "createdAt": "2026-03-09T05:24:48.181Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

**Code Snippet (Controller):**
```javascript
// File: Backend/suraiya/user/suraiya_ai_assistant/suraiya_ai.controller.js
export const getUserHistory = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const totalItems = await SuraiyaAiAssistant.countDocuments({ userId });
    const conversations = await SuraiyaAiAssistant.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    return res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error('Get History Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversation history',
    });
  }
};
```

---

### API 1.3: Submit Feedback on AI Response
**Description:** User submits feedback (helpful/not helpful) on an AI response

**Endpoint URL:** `http://localhost:1313/api/suraiya/ai-assistant/feedback/69ae59a03feafaa54ee27ec3`

**HTTP Method:** `PATCH`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "isHelpful": true
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "_id": "69ae59a03feafaa54ee27ec3",
    "isHelpful": true,
    "updatedAt": "2026-03-09T05:30:00.000Z"
  }
}
```

**Code Snippet (Controller):**
```javascript
// File: Backend/suraiya/user/suraiya_ai_assistant/suraiya_ai.controller.js
export const submitFeedback = async (req, res) => {
  const { id } = req.params;
  const { isHelpful } = req.body;

  try {
    if (typeof isHelpful !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isHelpful must be a boolean value',
      });
    }

    const conversation = await SuraiyaAiAssistant.findByIdAndUpdate(
      id,
      { isHelpful, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        _id: conversation._id,
        isHelpful: conversation.isHelpful,
        updatedAt: conversation.updatedAt,
      },
    });
  } catch (error) {
    console.error('Submit Feedback Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
    });
  }
};
```

---

## Feature 2: User Profile Management

### API 2.1: Get User Profile
**Description:** Retrieve user profile information including eco stats

**Endpoint URL:** `http://localhost:1313/api/profile/69abc778a3cbe96cddfa4b11`

**HTTP Method:** `GET`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:** None

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "69abc778a3cbe96cddfa4b11",
    "name": "Suraiya Rahman",
    "email": "suraiya@example.com",
    "phone": "+880 1234567890",
    "location": "Dhaka, Bangladesh",
    "bio": "Eco-warrior in training! Trying to make the world greener.",
    "totalRecycledItems": 142,
    "ecoPoints": 850,
    "createdAt": "2026-03-01T10:00:00.000Z",
    "updatedAt": "2026-03-09T05:00:00.000Z"
  }
}
```

**Code Snippet (Controller):**
```javascript
// File: Backend/suraiya/user/suraiya_profile/Suraiya_profile.controller.js
export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await SuraiyaProfile.findById(id).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
    });
  }
};
```

---

### API 2.2: Update User Profile
**Description:** Update user profile information (name, phone, location, bio)

**Endpoint URL:** `http://localhost:1313/api/profile/69abc778a3cbe96cddfa4b11`

**HTTP Method:** `PUT`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "Suraiya Rahman Updated",
  "phone": "+880 9876543210",
  "location": "Chittagong, Bangladesh",
  "bio": "Environmental activist passionate about sustainable living."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "69abc778a3cbe96cddfa4b11",
    "name": "Suraiya Rahman Updated",
    "email": "suraiya@example.com",
    "phone": "+880 9876543210",
    "location": "Chittagong, Bangladesh",
    "bio": "Environmental activist passionate about sustainable living.",
    "totalRecycledItems": 142,
    "ecoPoints": 850,
    "updatedAt": "2026-03-09T06:00:00.000Z"
  }
}
```

**Code Snippet (Controller):**
```javascript
// File: Backend/suraiya/user/suraiya_profile/Suraiya_profile.controller.js
export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, phone, location, bio } = req.body;

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;

    const user = await SuraiyaProfile.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};
```

---

### API 2.3: Create New User Profile
**Description:** Create a new user profile in the system

**Endpoint URL:** `http://localhost:1313/api/profile`

**HTTP Method:** `POST`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "phone": "+880 1111222233",
  "location": "Sylhet, Bangladesh",
  "bio": "Just getting started with eco-friendly living!"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User profile created successfully",
  "data": {
    "_id": "69abc778a3cbe96cddfa4b12",
    "name": "New User",
    "email": "newuser@example.com",
    "phone": "+880 1111222233",
    "location": "Sylhet, Bangladesh",
    "bio": "Just getting started with eco-friendly living!",
    "totalRecycledItems": 0,
    "ecoPoints": 0,
    "createdAt": "2026-03-09T06:00:00.000Z",
    "updatedAt": "2026-03-09T06:00:00.000Z"
  }
}
```

**Code Snippet (Controller):**
```javascript
// File: Backend/suraiya/user/suraiya_profile/Suraiya_profile.controller.js
export const createUserProfile = async (req, res) => {
  const { name, email, phone, location, bio } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required fields',
      });
    }

    const existingUser = await SuraiyaProfile.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const newUser = await SuraiyaProfile.create({
      name,
      email,
      phone: phone || '',
      location: location || '',
      bio: bio || '',
      totalRecycledItems: 0,
      ecoPoints: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Create Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user profile',
    });
  }
};
```

---

## BONUS: Admin Feature - AI Logs Management

### API 3.1: Get All AI Conversation Logs (Admin)
**Description:** Admin retrieves all AI conversation logs with filtering and pagination

**Endpoint URL:** `http://localhost:1313/api/suraiya/admin/ai-logs`

**HTTP Method:** `GET`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by waste category (recyclable, organic, hazardous, etc.)
- `isHelpful` (optional): Filter by feedback (true/false)
- `search` (optional): Search in questions/answers

**Example URL:** `http://localhost:1313/api/suraiya/admin/ai-logs?page=1&limit=10&category=recyclable`

**Request Body:** None

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "69ae59a03feafaa54ee27ec3",
        "userId": "suraiya_test_user_1",
        "userQuestion": "How do I recycle plastic bottles?",
        "aiResponse": "♻️ Great question! Clean your plastic bottles...",
        "wasteCategory": "recyclable",
        "isHelpful": true,
        "responseTime": 234,
        "createdAt": "2026-03-09T05:24:48.181Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10
    }
  }
}
```

---

### API 3.2: Get Analytics (Admin)
**Description:** Get analytics and statistics about AI assistant usage

**Endpoint URL:** `http://localhost:1313/api/suraiya/admin/ai-logs/analytics`

**HTTP Method:** `GET`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:**
- `startDate` (optional): Start date for analytics (ISO format)
- `endDate` (optional): End date for analytics (ISO format)

**Request Body:** None

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "totalConversations": 142,
    "totalUsers": 23,
    "averageResponseTime": 245,
    "categoryBreakdown": {
      "recyclable": 65,
      "organic": 42,
      "hazardous": 18,
      "nonRecyclable": 17
    },
    "feedbackStats": {
      "helpful": 98,
      "notHelpful": 12,
      "noFeedback": 32
    },
    "helpfulRate": 89.09
  }
}
```

---

## How to Test in Postman

### Step 1: Install Postman
Download from: https://www.postman.com/downloads/

### Step 2: Start Your Backend Server
```bash
cd Backend
npm start
```
Server should be running on: http://localhost:1313

### Step 3: Create New Request in Postman

For **POST/PUT/PATCH** requests:
1. Select HTTP method (POST, PUT, PATCH)
2. Enter URL: `http://localhost:1313/api/suraiya/ai-assistant/ask`
3. Go to **Headers** tab → Add `Content-Type: application/json`
4. Go to **Body** tab → Select **raw** → Choose **JSON**
5. Paste request body
6. Click **Send**

For **GET** requests:
1. Select GET method
2. Enter URL with parameters
3. Click **Send**

### Step 4: Take Screenshots
Capture:
- Request URL and Method
- Request Headers
- Request Body (if applicable)
- Response Status Code
- Response Body

---

## Database Models

### AI Assistant Model
```javascript
// File: Backend/suraiya/user/suraiya_ai_assistant/suraiya_ai.model.js
const suraiyaAiSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  userQuestion: { type: String, required: true },
  aiResponse: { type: String, required: true },
  wasteCategory: { type: String, enum: ['recyclable', 'organic', 'hazardous', 'nonRecyclable', 'general'] },
  isHelpful: { type: Boolean, default: null },
  sessionId: { type: String },
  ipAddress: { type: String },
  responseTime: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### User Profile Model
```javascript
// File: Backend/suraiya/user/suraiya_profile/Suraiya_profile.model.js
const suraiyaProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  totalRecycledItems: { type: Number, default: 0 },
  ecoPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

---

## Assignment Checklist

- [x] Backend server running on port **1313** (last 4 digits of student ID)
- [x] Database connected (MongoDB Atlas)
- [x] Two features implemented:
  - Feature 1: AI Waste Assistant (3 APIs)
  - Feature 2: User Profile Management (3 APIs)
- [x] Each API documented with:
  - Endpoint URL
  - HTTP Method
  - Headers
  - Request Body/Parameters
  - Response format
  - Code snippets
- [ ] Test each API in Postman
- [ ] Take screenshots for each API
- [ ] Submit documentation with screenshots

---

**Good luck with your assignment! 🚀**
