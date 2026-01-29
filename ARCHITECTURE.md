# 🏢 HR Recruitment App - Complete Architecture Guide

## 📋 Table of Contents
1. [System Architecture Diagram](#system-architecture-diagram)
2. [Component Overview](#component-overview)
3. [Technical Stack](#technical-stack)
4. [Step-by-Step Data Flow](#step-by-step-data-flow)
5. [Code Implementation](#code-implementation)
6. [Database Schema](#database-schema)
7. [Deployment Architecture](#deployment-architecture)
8. [API Endpoints](#api-endpoints)

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🌐 CLIENT LAYER (Frontend)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐   ┌─────────────────┐   ┌──────────────────────┐      │
│  │  Employee Side  │   │   Admin Side    │   │   Public Pages       │      │
│  ├─────────────────┤   ├─────────────────┤   ├──────────────────────┤      │
│  │ • login.html    │   │ • admin-login   │   │ • index.html         │      │
│  │ • signup.html   │   │ • admin-dash    │   │ • hiring_process.html│      │
│  │ • dashboard.html│   │ • admin-emp     │   │ • onboarding.html    │      │
│  │ • apply_leave   │   │ • admin-leaves  │   │ • style.css          │      │
│  │ • attendance    │   │ • admin-att     │   │ • script.js          │      │
│  │ • grievance     │   │ • admin-griev   │   │                      │      │
│  │ • leave_balance │   │                 │   │                      │      │
│  └─────────────────┘   └─────────────────┘   └──────────────────────┘      │
│           │                     │                        │                  │
└───────────┼─────────────────────┼────────────────────────┼──────────────────┘
            │                     │                        │
            └─────────────────────┼────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              🚪 API GATEWAY LAYER (Express.js Server)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Express.js Server (Port 3000)                                      │   │
│  │  ═════════════════════════════════════════════════════════════     │   │
│  │  • Request Router                                                   │   │
│  │  • Middleware (body-parser, CORS)                                  │   │
│  │  • Static File Server                                              │   │
│  │  • MongoDB Connection Manager                                      │   │
│  │  • Health Check Endpoints                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└──────────────────┬──────────────────────────────────────────────────────────┘
                   │
      ┌────────────┼────────────┬────────────┬────────────┬────────────┐
      ▼            ▼            ▼            ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐
│  Auth    │  │ Employee │  │  Leave   │  │Attendance│  │Grievance │ │ Chatbot  │
│ Service  │  │ Service  │  │ Service  │  │ Service  │  │ Service  │ │ Service  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ └──────────┘
      │            │            │            │            │            │
      └────────────┼────────────┴────────────┴────────────┴────────────┘
                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│            💾 DATABASE LAYER (MongoDB - Port 27017)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  MongoDB (hr_system Database)                                       │   │
│  │  Collections:                                                        │   │
│  │  ├─ employees (user profiles & credentials)                        │   │
│  │  ├─ leave_requests (leave applications)                            │   │
│  │  ├─ attendance (check-in/out logs)                                 │   │
│  │  ├─ grievances (employee grievances)                               │   │
│  │  ├─ chat_logs (chatbot conversation history)                       │   │
│  │  └─ [other collections as needed]                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────────────────────┐
        │  🐳 CONTAINERIZATION LAYER (Docker)                  │
        ├──────────────────────────────────────────────────────┤
        │  • recruitment-app (Node.js container)               │
        │  • mongo (MongoDB container)                         │
        │  • Volume: mongo-data (persistent storage)           │
        │  • Network: recruitment-net (bridge)                 │
        └──────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────────────────────┐
        │  ☸️  ORCHESTRATION LAYER (Kubernetes)                │
        ├──────────────────────────────────────────────────────┤
        │  • Namespace: recruitment                            │
        │  • Deployment: recruitment-app (2 replicas)         │
        │  • Service: LoadBalancer                             │
        │  • ConfigMap: mongo-init (database initialization)   │
        │  • Secret: credentials (API keys, passwords)         │
        └──────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────────────────────┐
        │  ☁️  CLOUD DEPLOYMENT (Azure)                        │
        ├──────────────────────────────────────────────────────┤
        │  • Azure Container Registry (ACR)                    │
        │  • Azure Kubernetes Service (AKS)                    │
        │  • Azure CosmosDB (MongoDB API)                      │
        │  • Azure DevOps (CI/CD Pipeline)                     │
        └──────────────────────────────────────────────────────┘
```

---

## Component Overview

### 1. **Frontend Layer** (Client-Side)
- **Employee Portal**: Login, dashboard, apply leave, check attendance, submit grievances
- **Admin Portal**: Employee management, leave approvals, attendance reports, grievance handling
- **Public Pages**: Onboarding, hiring info, landing page

### 2. **API Gateway** (Express.js)
- Central entry point for all frontend requests
- Routes requests to appropriate services
- Manages MongoDB connections
- Health checks (liveness & readiness probes)

### 3. **Microservices** (Business Logic)
- Authentication Service
- Employee Service
- Leave Management Service
- Attendance Service
- Grievance Service
- Chatbot Service
- Analytics Service

### 4. **Database Layer** (MongoDB)
- Monolithic database with multiple collections
- Can be split into microservices databases in future

### 5. **Deployment Stack**
- **Docker**: Containerization
- **Docker Compose**: Local orchestration
- **Kubernetes**: Production orchestration
- **Azure**: Cloud hosting

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, JavaScript | User interface |
| **Backend** | Node.js, Express.js | API server |
| **Database** | MongoDB | NoSQL data storage |
| **Containerization** | Docker | Application packaging |
| **Orchestration** | Kubernetes, Helm | Production deployment |
| **Cloud** | Microsoft Azure | Cloud infrastructure |
| **CI/CD** | Azure DevOps | Automated deployment |

---

## Step-by-Step Data Flow

### Example 1: Employee Login Flow

```
┌─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┐
│ STEP 1: User Action                                       │
└─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
    User enters credentials in login.html
    ├─ Employee ID: EMP001
    ├─ Password: secret123
    └─ Clicks "Login" button

         │ JavaScript onclick event triggered
         ▼

┌─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┐
│ STEP 2: Form Submission                                   │
└─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
    POST request sent to /api/login
    Payload: { empId: "EMP001", password: "secret123" }

         │ HTTP request over network
         ▼

┌─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┐
│ STEP 3: Server Reception (Express.js)                    │
└─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
    app.post('/api/login', async (req, res) => {
      // Step 3a: Validate database connection
      if (!db) return res.status(503).json({ message: 'DB not ready' });
      
      // Step 3b: Extract credentials from request
      const { empId, password } = req.body;

         │
         ▼

┌─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┐
│ STEP 4: Database Query                                    │
└─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
      // Step 4a: Search for employee in employees collection
      const user = await db.collection('employees').findOne({ 
        empId, 
        password 
      });

         │ MongoDB query execution
         ▼

┌─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┐
│ STEP 5: Authentication Logic                              │
└─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
      // Step 5a: Check if user found
      if (!user) 
        return res.status(401).json({ message: 'Invalid credentials' });
      
      // Step 5b: User found - authentication successful
      res.json({ message: 'Login successful' });
    });

         │ Response sent back
         ▼

┌─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┐
│ STEP 6: Client Response Handling                          │
└─────────────────━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
    Response received by browser (script.js)
    ├─ Status: 200 OK
    ├─ Body: { message: 'Login successful' }
    └─ JavaScript redirects to dashboard.html

         │
         ▼

         ✅ USER LOGGED IN SUCCESSFULLY
```

### Example 2: Leave Application Flow

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: Employee Submits Leave Request                      │
└──────────────────────────────────────────────────────────────┘
    POST /api/leave/apply
    Payload:
    {
      empId: "EMP001",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      leaveReason: "Medical emergency"
    }

    app.post('/api/leave/apply', async (req, res) => {
      if (!db) return res.status(503).json({ message: 'DB not ready' });
      
      const { empId, startDate, endDate, leaveReason } = req.body;
      
      // Insert into leave_requests collection
      await db.collection('leave_requests').insertOne({
        empId,
        startDate,
        endDate,
        leaveReason,
        status: 'Pending',           // Initial status
        appliedAt: new Date()
      });
      
      res.json({ message: 'Leave request submitted' });
    });

         │ Data stored in MongoDB
         ▼

        Database State:
        ┌─ leave_requests collection
        │  ├─ _id: ObjectId(...)
        │  ├─ empId: "EMP001"
        │  ├─ startDate: "2024-02-01"
        │  ├─ endDate: "2024-02-05"
        │  ├─ leaveReason: "Medical emergency"
        │  ├─ status: "Pending"
        │  └─ appliedAt: Date(...)
        └─ [more leave requests...]

         │
         ▼

┌──────────────────────────────────────────────────────────────┐
│ STEP 2: Admin Reviews Leave Requests                        │
└──────────────────────────────────────────────────────────────┘
    Admin accesses: admin-leaves.html
    GET /api/admin/leaves
    
    Response: Array of all pending leave requests
    
    [
      {
        _id: "...",
        empId: "EMP001",
        startDate: "2024-02-01",
        endDate: "2024-02-05",
        leaveReason: "Medical emergency",
        status: "Pending"
      },
      { ... more requests ... }
    ]

         │ Admin reviews and takes action
         ▼

┌──────────────────────────────────────────────────────────────┐
│ STEP 3: Admin Approves/Rejects Leave                        │
└──────────────────────────────────────────────────────────────┘
    PUT /api/admin/leaves/:id
    Payload:
    {
      status: "Approved",  // or "Rejected"
      approvalNotes: "Approved for medical reasons"
    }
    
    app.put('/api/admin/leaves/:id', async (req, res) => {
      const { status, approvalNotes } = req.body;
      const leaveId = new ObjectId(req.params.id);
      
      await db.collection('leave_requests').updateOne(
        { _id: leaveId },
        {
          $set: {
            status: status,
            approvalNotes: approvalNotes,
            approvedAt: new Date()
          }
        }
      );
      
      res.json({ message: 'Leave request updated' });
    });

         │ Database updated
         ▼

        Database State (Updated):
        ┌─ leave_requests
        │  ├─ status: "Approved"  ✅
        │  ├─ approvalNotes: "Approved for medical reasons"
        │  └─ approvedAt: Date(...)
        └─

         │
         ▼

        ✅ LEAVE REQUEST APPROVED
        Employee can now access their leave balance
        and see the updated status
```

---

## Code Implementation

### 1. Server Startup & Database Connection

```javascript
// server.js - Main Server File

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();

/* ===== ENVIRONMENT VARIABLES ===== */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URL; // MongoDB connection string
const DB_NAME = process.env.DB_NAME || 'hr_system';

/* ===== MIDDLEWARE ===== */
app.use(bodyParser.json());                                    // Parse JSON requests
app.use(express.static(path.join(__dirname, 'public')));      // Serve static files

/* ===== DATABASE CONNECTION ===== */
let db = null;
let mongoClient = null;

async function connectMongo() {
  try {
    console.log('⏳ Connecting to MongoDB:', MONGO_URI);
    
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    
    db = mongoClient.db(DB_NAME);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    db = null;
    
    // Retry after 5 seconds
    setTimeout(connectMongo, 5000);
  }
}

connectMongo();

/* ===== HEALTH ENDPOINTS ===== */

// Liveness Probe: Check if server is running
app.get('/healthz', (req, res) => {
  res.sendStatus(200);  // Always returns 200
});

// Readiness Probe: Check if database is connected
app.get('/health', (req, res) => {
  if (db) return res.sendStatus(200);
  res.sendStatus(503);  // Service Unavailable
});

/* ===== START SERVER ===== */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server started on port ${PORT}`);
});
```

### 2. Authentication Service

```javascript
/* ===== EMPLOYEE AUTHENTICATION ===== */

// Sign Up - Create new employee account
app.post('/api/signup', async (req, res) => {
  // Check database connection
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  // Extract data from request
  const { fullName, empId, email, password } = req.body;
  
  // Validate all required fields
  if (!fullName || !empId || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  // Check if employee already exists
  const existing = await db.collection('employees').findOne({
    $or: [{ empId }, { email }]
  });

  if (existing) {
    return res.status(409).json({ message: 'Employee already exists' });
  }

  // Create new employee record
  await db.collection('employees').insertOne({
    fullName,
    empId,
    email,
    password
  });

  res.json({ message: 'Signup successful' });
});

// Login - Authenticate employee
app.post('/api/login', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { empId, password } = req.body;
  
  // Find employee with matching credentials
  const user = await db.collection('employees').findOne({ empId, password });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.json({ message: 'Login successful' });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { adminId, password } = req.body;
  
  // Hardcoded admin credentials (⚠️ Should use proper auth in production)
  if (adminId === 'admin' && password === 'admin123') {
    return res.json({ message: 'Admin login successful' });
  }
  
  res.status(401).json({ message: 'Invalid admin credentials' });
});
```

### 3. Leave Management Service

```javascript
/* ===== LEAVE MANAGEMENT ===== */

// Apply for Leave
app.post('/api/leave/apply', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { empId, startDate, endDate, leaveReason } = req.body;

  // Create leave request record
  await db.collection('leave_requests').insertOne({
    empId,
    startDate,
    endDate,
    leaveReason,
    status: 'Pending',          // Default status
    appliedAt: new Date()
  });

  res.json({ message: 'Leave request submitted' });
});

// Get Leave Balance for Employee
app.get('/api/leave/balance/:empId', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { empId } = req.params;

  // Calculate leave balance
  const approvedLeaves = await db.collection('leave_requests')
    .find({ empId, status: 'Approved' })
    .toArray();

  const totalDaysUsed = approvedLeaves.reduce((sum, leave) => {
    // Calculate days between dates
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
    return sum + days;
  }, 0);

  const totalLeaveAllowed = 37; // 12 CL + 10 SL + 15 AL
  const remainingBalance = totalLeaveAllowed - totalDaysUsed;

  res.json({
    totalLeaveAllowed,
    daysUsed: totalDaysUsed,
    remainingBalance
  });
});

// Admin: View All Leave Requests
app.get('/api/admin/leaves', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const leaves = await db.collection('leave_requests').find({}).toArray();
  res.json(leaves);
});

// Admin: Approve/Reject Leave Request
app.put('/api/admin/leaves/:id', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { status, approvalNotes } = req.body;
  const leaveId = new ObjectId(req.params.id);

  await db.collection('leave_requests').updateOne(
    { _id: leaveId },
    {
      $set: {
        status: status,              // "Approved" or "Rejected"
        approvalNotes: approvalNotes,
        approvedAt: new Date()
      }
    }
  );

  res.json({ message: 'Leave request updated' });
});
```

### 4. Chatbot Service

```javascript
/* ===== HR CHATBOT ===== */

// HR Knowledge Base
const hrKnowledgeBase = {
  'leave policy': 'Employees are entitled to 12 days of casual leave, 10 days of sick leave, and 15 days of annual leave per year.',
  'attendance policy': 'Standard working hours are 9 AM to 6 PM.',
  'holidays': 'Public holidays include New Year, Independence Day, Diwali, and Christmas.',
  'grievance procedure': 'Grievances are reviewed within 3 business days.',
  'salary policy': 'Salaries are processed on the last working day of each month.'
};

// Generate chatbot response based on knowledge base
function getChatbotResponse(query) {
  const lowerQuery = query.toLowerCase();
  
  // Search through knowledge base
  for (const [key, value] of Object.entries(hrKnowledgeBase)) {
    if (lowerQuery.includes(key)) {
      return value;
    }
  }
  
  return 'Sorry, I do not have information on that topic.';
}

// Chatbot API Endpoint
app.post('/api/chatbot', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { query, empId } = req.body;
  
  // Get response from knowledge base
  const response = getChatbotResponse(query);

  // Log chat interaction
  await db.collection('chat_logs').insertOne({
    empId: empId || 'anonymous',
    query,
    response,
    timestamp: new Date()
  });

  res.json({ response });
});
```

### 5. Frontend Integration (script.js)

```javascript
/* ===== Frontend API Calls ===== */

// Login Function
async function login() {
  const empId = document.getElementById('empId').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empId, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Store user info and redirect
      localStorage.setItem('empId', empId);
      alert('Login successful!');
      window.location.href = '/dashboard.html';
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error. Please try again.');
  }
}

// Apply Leave Function
async function applyLeave() {
  const empId = localStorage.getItem('empId');
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const leaveReason = document.getElementById('leaveReason').value;

  try {
    const response = await fetch('/api/leave/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        empId,
        startDate,
        endDate,
        leaveReason
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Leave request submitted successfully!');
      document.getElementById('leaveForm').reset();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error. Please try again.');
  }
}

// Chatbot Query Function
async function sendChatbotQuery() {
  const empId = localStorage.getItem('empId');
  const query = document.getElementById('chatInput').value;

  try {
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, empId })
    });

    const data = await response.json();

    if (response.ok) {
      // Display chatbot response
      document.getElementById('chatOutput').innerHTML += 
        `<p><strong>Bot:</strong> ${data.response}</p>`;
      document.getElementById('chatInput').value = '';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## Database Schema

### MongoDB Collections Structure

```javascript
/* ===== EMPLOYEES COLLECTION ===== */
db.employees.insertOne({
  _id: ObjectId("..."),
  fullName: "John Doe",
  empId: "EMP001",
  email: "john.doe@company.com",
  password: "hashedPassword123",  // Should be hashed in production
  createdAt: date,
  department: "Engineering",
  designation: "Senior Developer",
  status: "Active"
})

/* ===== LEAVE_REQUESTS COLLECTION ===== */
db.leave_requests.insertOne({
  _id: ObjectId("..."),
  empId: "EMP001",
  startDate: "2024-02-01",
  endDate: "2024-02-05",
  leaveReason: "Medical emergency",
  status: "Pending",              // "Approved", "Rejected", "Pending"
  appliedAt: date,
  approvedAt: date,
  approvalNotes: "Approved for medical reasons"
})

/* ===== ATTENDANCE COLLECTION ===== */
db.attendance.insertOne({
  _id: ObjectId("..."),
  empId: "EMP001",
  checkinTime: date,              // When employee checked in
  checkoutTime: date,             // When employee checked out
  workingHours: 8.5,              // Hours worked
  date: "2024-01-28",
  status: "Present"               // "Present", "Absent", "On Leave"
})

/* ===== GRIEVANCES COLLECTION ===== */
db.grievances.insertOne({
  _id: ObjectId("..."),
  empId: "EMP001",
  title: "Unfair treatment",
  description: "Manager treats me unfairly compared to other team members",
  severity: "High",               // "Low", "Medium", "High"
  status: "Under Review",         // "Submitted", "Under Review", "Resolved"
  submittedAt: date,
  resolvedAt: date,
  adminResponse: "We will investigate this matter"
})

/* ===== CHAT_LOGS COLLECTION ===== */
db.chat_logs.insertOne({
  _id: ObjectId("..."),
  empId: "EMP001",
  query: "What is the leave policy?",
  response: "Employees are entitled to 12 days of casual leave...",
  timestamp: date
})
```

---

## Deployment Architecture

### 1. Docker Compose (Local Development)

```yaml
version: "3.9"

services:
  # Application Container
  recruitment-app:
    container_name: recruitment-app
    build:
      context: .
      dockerfile: Dockerfile
    image: recruitment-app:local
    ports:
      - "3000:3000"                    # Map port 3000
    environment:
      MONGO_URL: mongodb://mongo:27017/hr_system
      NODE_ENV: development
    depends_on:
      - mongo                           # Wait for MongoDB to start
    networks:
      - recruitment-net

  # Database Container
  mongo:
    container_name: mongo
    image: mongo:6
    restart: always
    ports:
      - "27017:27017"                  # Map MongoDB port
    volumes:
      - mongo-data:/data/db             # Persistent storage
      - ./mongo-init-dev:/docker-entrypoint-initdb.d  # Init scripts
    networks:
      - recruitment-net

volumes:
  mongo-data:                           # Named volume for database

networks:
  recruitment-net:                      # Bridge network
    driver: bridge
```

### 2. Kubernetes Deployment (Production)

```yaml
# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: recruitment

---
# ConfigMap for MongoDB Initialization
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongo-init-configmap
  namespace: recruitment
data:
  init.js: |
    db = db.getSiblingDB('hr_system');
    db.createCollection('employees');
    db.createCollection('leave_requests');
    db.createCollection('attendance');
    db.createCollection('grievances');
    db.createCollection('chat_logs');

---
# Secret for Credentials
apiVersion: v1
kind: Secret
metadata:
  name: recruitment-secret
  namespace: recruitment
type: Opaque
stringData:
  MONGO_URL: mongodb://mongo:27017/hr_system
  DB_NAME: hr_system

---
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: recruitment-app
  namespace: recruitment
spec:
  replicas: 2                           # 2 replicas for high availability
  selector:
    matchLabels:
      app: recruitment
  template:
    metadata:
      labels:
        app: recruitment
    spec:
      containers:
      - name: app
        image: acrmd.azurecr.io/recruitment-app:1
        ports:
        - containerPort: 3000
        env:
        - name: MONGO_URL
          valueFrom:
            secretKeyRef:
              name: recruitment-secret
              key: MONGO_URL
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: recruitment-secret
              key: DB_NAME
        # Health checks for reliability
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5

---
# Service - Expose the application
apiVersion: v1
kind: Service
metadata:
  name: recruitment-service
  namespace: recruitment
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: recruitment

---
# MongoDB Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo
  namespace: recruitment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - name: mongo
        image: mongo:6
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: mongo-storage
          mountPath: /data/db
        - name: mongo-init
          mountPath: /docker-entrypoint-initdb.d
      volumes:
      - name: mongo-storage
        emptyDir: {}
      - name: mongo-init
        configMap:
          name: mongo-init-configmap

---
# MongoDB Service
apiVersion: v1
kind: Service
metadata:
  name: mongo
  namespace: recruitment
spec:
  ports:
  - port: 27017
    targetPort: 27017
  selector:
    app: mongo
```

---

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/signup` | Employee registration |
| POST | `/api/login` | Employee login |
| POST | `/api/admin/login` | Admin login |

### Leave Management Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/leave/apply` | Submit leave request |
| GET | `/api/leave/balance/:empId` | Get remaining leave balance |
| GET | `/api/leave/history/:empId` | Get employee's leave history |
| GET | `/api/admin/leaves` | Get all leave requests (Admin) |
| PUT | `/api/admin/leaves/:id` | Approve/Reject leave (Admin) |

### Employee Management Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/employees` | Get all employees (Admin) |
| PUT | `/api/admin/employees/:id` | Update employee profile (Admin) |
| DELETE | `/api/admin/employees/:id` | Delete employee (Admin) |

### Attendance Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/attendance/checkin` | Check-in |
| POST | `/api/attendance/checkout` | Check-out |
| GET | `/api/attendance/today` | Get today's status |
| GET | `/api/admin/attendance` | Get all attendance (Admin) |

### Other Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/grievance` | Submit grievance |
| GET | `/api/admin/grievances` | Get all grievances (Admin) |
| PUT | `/api/admin/grievances/:id` | Update grievance (Admin) |
| POST | `/api/chatbot` | Query HR chatbot |

### Health Check Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/healthz` | Liveness probe |
| GET | `/health` | Readiness probe |

---

## Summary

This HR Recruitment App follows a **monolithic architecture with microservices concepts** and is designed for:

1. **Scalability**: Can evolve into true microservices
2. **Reliability**: Health checks and database connection retry logic
3. **Containerization**: Docker for consistent deployment
4. **Orchestration**: Kubernetes for production scaling
5. **High Availability**: Multiple replicas and load balancing
6. **Cloud Native**: Azure integration ready

The system handles employee lifecycle management from hiring to daily operations with features for leave management, attendance tracking, grievances handling, and HR policy information through chatbot.
