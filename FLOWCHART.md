# Verification Flowchart - SafeLanka

This document provides a visual guide for the verification process after making changes.

## 📊 Main Verification Flow

```
┌─────────────────────────────────────────┐
│     Made Changes to Code?              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Run: ./verify.sh                      │
│   (Checks setup and dependencies)       │
└──────────────┬──────────────────────────┘
               │
               ▼
         ┌─────┴─────┐
         │  All OK?   │
         └─────┬─────┘
          YES  │  NO
     ┌─────────┴────────┐
     │                  │
     ▼                  ▼
┌─────────┐    ┌────────────────────┐
│Continue │    │ Fix Issues:        │
│         │    │ - Install deps     │
│         │    │ - Create .env      │
│         │    │ - Start MongoDB    │
└────┬────┘    └─────────┬──────────┘
     │                   │
     │◄──────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  What Did You Change?                   │
└──────────────┬──────────────────────────┘
               │
     ┌─────────┼──────────┬──────────┐
     │         │          │          │
     ▼         ▼          ▼          ▼
 ┌──────┐  ┌──────┐  ┌───────┐  ┌──────┐
 │Backend│  │Frontend│ │Database│ │ API  │
 └───┬──┘  └───┬───┘  └───┬───┘  └──┬───┘
     │         │          │         │
     └─────────┴──────────┴─────────┘
               │
               ▼
     ┌──────────────────┐
     │  Run Specific    │
     │  Verification    │
     └────────┬─────────┘
              │
              ▼
    ┌──────────────────┐
    │  All Tests Pass? │
    └────────┬─────────┘
         YES │  NO
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌────────┐      ┌──────────┐
│ Done! ✓│      │Debug/Fix │
└────────┘      └────┬─────┘
                     │
                     └──────┐
                            │
                Return to  │
                Start ◄────┘
```

## 🔀 Change-Specific Verification Paths

### Backend Changes
```
Backend Change Made
    │
    ▼
Start Backend Server
npm run dev:backend
    │
    ▼
Check Server Logs
✓ MongoDB connected
✓ Server running on port 5080
    │
    ▼
Test Health Endpoint
curl http://localhost:5080/health
    │
    ▼
Check Specific Feature
(API endpoint you changed)
    │
    ▼
Verify Database Impact
node check-database.js
    │
    ▼
✓ Done
```

### Frontend Changes
```
Frontend Change Made
    │
    ▼
Start Frontend Server
npm run dev:frontend
    │
    ▼
Open Browser
http://localhost:5173
    │
    ▼
Open DevTools (F12)
Check Console & Network tabs
    │
    ▼
Navigate to Changed Page
Verify visual changes
    │
    ▼
Test User Interactions
Click, submit forms, etc.
    │
    ▼
Test Responsive Design
Resize window/use DevTools
    │
    ▼
✓ Done
```

### Database/Model Changes
```
Database Change Made
    │
    ▼
Start Backend Server
(connects to database)
    │
    ▼
Run Database Check
node backend/check-database.js
    │
    ▼
Verify:
- Collections exist
- Data structure correct
- Relationships work
    │
    ▼
Test CRUD Operations
- Create new document
- Read document
- Update document
- Delete document
    │
    ▼
Check in MongoDB Compass
(Visual verification)
    │
    ▼
✓ Done
```

### API Endpoint Changes
```
API Change Made
    │
    ▼
Start Backend Server
npm run dev:backend
    │
    ▼
Test with curl
curl http://localhost:5080/api/your-endpoint
    │
    ▼
Check Response:
- Status code correct?
- Data format correct?
- Error handling works?
    │
    ▼
Test from Frontend
Make API call from UI
    │
    ▼
Check Database Impact
node check-database.js
    │
    ▼
✓ Done
```

## 🧪 Testing Decision Tree

```
Need to Verify Changes?
    │
    ▼
┌───────────────────┐
│ Quick Smoke Test? │  ───YES──► Run ./verify.sh
└─────┬─────────────┘
      │ NO
      ▼
┌───────────────────┐
│ Full Manual Test? │  ───YES──► Follow TESTING.md
└─────┬─────────────┘
      │ NO
      ▼
┌───────────────────┐
│   API Testing?    │  ───YES──► Use curl/Postman
└─────┬─────────────┘
      │ NO
      ▼
┌───────────────────┐
│ Database Check?   │  ───YES──► Run check-database.js
└─────┬─────────────┘
      │ NO
      ▼
┌───────────────────┐
│  Need Examples?   │  ───YES──► Check QUICK_REFERENCE.md
└───────────────────┘
```

## 🔍 Debugging Decision Tree

```
Something Not Working?
    │
    ▼
┌─────────────────────┐
│ Server Won't Start? │
└──────┬──────────────┘
   YES │ NO
       │
       ▼
  ┌────────────────┐
  │Check:          │
  │- Port in use?  │
  │- Dependencies? │
  │- .env exists?  │
  └────────────────┘

       │ NO
       ▼
┌─────────────────────┐
│ Can't Connect DB?   │
└──────┬──────────────┘
   YES │ NO
       │
       ▼
  ┌────────────────┐
  │Check:          │
  │- MongoDB on?   │
  │- URI correct?  │
  │- Firewall?     │
  └────────────────┘

       │ NO
       ▼
┌─────────────────────┐
│ Frontend Not Load?  │
└──────┬──────────────┘
   YES │ NO
       │
       ▼
  ┌────────────────┐
  │Check:          │
  │- Backend on?   │
  │- CORS setup?   │
  │- API URL?      │
  │- Console errs? │
  └────────────────┘

       │ NO
       ▼
┌─────────────────────┐
│   API Returns Error?│
└──────┬──────────────┘
   YES │
       │
       ▼
  ┌────────────────┐
  │Check:          │
  │- Auth token?   │
  │- Request body? │
  │- Endpoint URL? │
  │- Server logs?  │
  └────────────────┘
```

## 📋 Quick Checklist Decision

```
Choose Your Checklist:

┌─────────────────────────┐
│ Just Made a Code Change?│
└───────────┬─────────────┘
            │
            ▼
Use This Checklist:
□ Code compiles
□ No lint errors  
□ Server starts
□ Feature works
□ No console errors
□ Database OK

┌─────────────────────────┐
│ About to Commit Code?   │
└───────────┬─────────────┘
            │
            ▼
Use This Checklist:
□ ./verify.sh passes
□ All tests pass
□ Documentation updated
□ No debug code left
□ Commit message clear

┌─────────────────────────┐
│ Reviewing Pull Request? │
└───────────┬─────────────┘
            │
            ▼
Use This Checklist:
□ Code review done
□ Tests included
□ Documentation updated
□ No breaking changes
□ Security checked
□ Performance OK
```

## 🎯 Priority Matrix

```
              High Impact
                  ▲
                  │
      ┌───────────┼───────────┐
      │           │           │
      │  CRITICAL │  IMPORTANT│
      │  Do First │ Do Second │
Low   │           │           │  High
Cost  ├───────────┼───────────┤  Cost
      │           │           │
      │  QUICK    │  AVOID    │
      │  Do Third │ If Possible│
      │           │           │
      └───────────┼───────────┘
                  │
              Low Impact

CRITICAL: Auth bugs, data loss, crashes
IMPORTANT: UI bugs, performance issues
QUICK: Typos, cosmetic issues
AVOID: Over-engineering, premature optimization
```

## 🚦 Status Indicators

```
✅ PASS    - Feature works as expected
⚠️  WARNING - Works but has issues
❌ FAIL    - Feature broken
🔄 PENDING - Awaiting verification
📝 TODO    - Not yet implemented
🐛 BUG     - Known issue
```

## 📞 When to Ask for Help

```
Try to Fix (5-15 min)
    │
    ▼
Research (15-30 min)
- Check docs
- Search GitHub issues
- Check Stack Overflow
    │
    ▼
Still Stuck?
    │
    ▼
Ask Team Member
- Provide error message
- Show what you tried
- Share relevant code
    │
    ▼
Create Detailed Issue
- Steps to reproduce
- Expected vs actual
- Environment info
- Screenshots/logs
```

---

## 📚 Related Documentation

- **[VERIFICATION.md](VERIFICATION.md)** - Detailed verification steps
- **[TESTING.md](TESTING.md)** - Comprehensive testing guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference
- **[README.md](README.md)** - Project overview

---

**Remember:** 
- Verify early, verify often
- Small changes are easier to verify
- When in doubt, check the logs
- Don't skip the verification step!
