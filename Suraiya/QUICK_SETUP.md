# 🚀 Quick Setup Guide

## ⏱️ Get Running in 10 Minutes

### Step 1: Install MongoDB (Choose One)

**Option A: MongoDB Atlas (Recommended - Free Cloud Database)**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a free M0 cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Save this for Step 3

**Option B: Local MongoDB**

Windows:
```powershell
# Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb

# Start MongoDB
mongod
```

Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Linux:
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### Step 2: Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies (in project root)
cd ..
npm install
```

### Step 3: Configure Environment

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/porichhonno
PORT=5000
```

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/porichhonno
PORT=5000
```

### Step 4: Seed Database

```bash
# Still in backend folder
npm run seed
```

You should see:
```
✅ Created 6 scrap rates
✅ Created 10 eco tips
✅ Created user: default-user
✨ Database seeded successfully!
```

### Step 5: Start Backend

```bash
# In backend folder
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### Step 6: Start Frontend

Open a NEW terminal:

```bash
# In project root
npm run dev
```

You should see:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

### Step 7: Test It!

**Test Backend API:**
- Open http://localhost:5000 - You should see API documentation
- Open http://localhost:5000/api/health - Should return `{"status":"OK"}`
- Open http://localhost:5000/api/eco-tips/random - Should return a random eco tip

**Test Frontend:**
- Open http://localhost:3000 - You should see your home page
- Navigate to your features (My Logs, Profile, etc.)

### Step 8: Connect Frontend to Backend

1. Create `frontend/.env.local` in your project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

2. Test the integrated example page:
```bash
# Copy the example page to your app folder
cp frontend/suraiya/recycling-log/pages/integrated-example.tsx app/test-backend.tsx
```

3. Visit http://localhost:3000/test-backend
4. Try adding a recycling log entry!

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend starts without errors (port 5000)
- [ ] Frontend starts without errors (port 3000)
- [ ] http://localhost:5000/api/health returns OK
- [ ] http://localhost:5000/api/logs returns an array
- [ ] Home page loads at http://localhost:3000
- [ ] Can add a test log entry

## 🐛 Troubleshooting

**"Failed to connect to MongoDB"**
- Check your `MONGODB_URI` in `.env`
- If using local MongoDB, make sure `mongod` is running
- If using Atlas, check your username/password and IP whitelist

**"Port 5000 already in use"**
- Change `PORT=5001` in `backend/.env`
- Update frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

**"Cannot find module"**
- Run `npm install` in both root and backend folders

**CORS Errors**
- Make sure backend is running
- Check that `NEXT_PUBLIC_API_URL` matches your backend port

## 📊 Test Data

After seeding, you have:
- 6 scrap rates (pricing for each material type)
- 10 eco tips
- 1 default user

## 🎯 Next Steps

1. Copy your existing components to feature folders
2. Update imports to use shared lib/api.ts
3. Replace mock data with API calls
4. Test each feature one by one

## 📚 Resources

- [MongoDB Atlas Tutorial](https://docs.atlas.mongodb.com/getting-started/)
- [Express.js Guide](https://expressjs.com/en/starter/installing.html)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Need Help?** Check the full [README_MIGRATION.md](README_MIGRATION.md) for detailed documentation.
