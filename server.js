const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();

// ===== ENV CONFIG =====
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URL || 'mongodb://mongo:27017/hr_system';
const DB_NAME = process.env.DB_NAME || 'hr_system';

// ===== MIDDLEWARE =====
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== GLOBAL DB HANDLE =====
let db = null;

// ===== HEALTH ENDPOINTS (REQUIRED FOR K8s) =====
app.get('/healthz', (req, res) => {
  res.sendStatus(200); // App is alive
});

app.get('/health', (req, res) => {
  if (db) {
    res.sendStatus(200); // Ready only when Mongo is connected
  } else {
    res.sendStatus(503);
  }
});

// ===== START SERVER FIRST (IMPORTANT) =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// ===== CONNECT TO MONGODB (ASYNC, NO EXIT) =====
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    console.log('MongoDB connected:', MONGO_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// ===================================================
// ================== APP ROUTES =====================
// ===================================================

// HR Knowledge Base for Chatbot
const hrKnowledgeBase = {
  'leave policy': 'Employees are entitled to 12 days of casual leave, 10 days of sick leave, and 15 days of annual leave per year.',
  'attendance policy': 'Standard working hours are 9 AM to 6 PM.',
  'holidays': 'Public holidays include New Year, Independence Day, Diwali, and Christmas.',
  'grievance procedure': 'Grievances are reviewed within 3 business days.',
  'salary policy': 'Salaries are processed on the last working day of each month.',
};

// Chatbot helper
function getChatbotResponse(query) {
  const lowerQuery = query.toLowerCase();
  for (const [key, value] of Object.entries(hrKnowledgeBase)) {
    if (lowerQuery.includes(key)) return value;
  }
  return 'Sorry, I do not have information on that topic.';
}

// ================= AUTH =================
app.post('/api/signup', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { fullName, empId, email, password } = req.body;
  if (!fullName || !empId || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const existing = await db.collection('employees').findOne({
    $or: [{ empId }, { email }]
  });

  if (existing) {
    return res.status(409).json({ message: 'Employee already exists' });
  }

  await db.collection('employees').insertOne({
    fullName, empId, email, password
  });

  res.json({ message: 'Signup successful' });
});

app.post('/api/login', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { empId, password } = req.body;
  const user = await db.collection('employees').findOne({ empId, password });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful' });
});

// ================= CHATBOT =================
app.post('/api/chatbot', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { query, empId } = req.body;
  const response = getChatbotResponse(query);

  await db.collection('chat_logs').insertOne({
    empId: empId || 'anonymous',
    query,
    response,
    timestamp: new Date()
  });

  res.json({ response });
});

// ================= LEAVE =================
app.post('/api/leave/apply', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const { empId, startDate, endDate, leaveReason } = req.body;

  await db.collection('leave_requests').insertOne({
    empId,
    startDate,
    endDate,
    leaveReason,
    status: 'Pending',
    appliedAt: new Date()
  });

  res.json({ message: 'Leave request submitted' });
});

// ================= ADMIN =================
app.post('/api/admin/login', async (req, res) => {
  const { adminId, password } = req.body;
  if (adminId === 'admin' && password === 'admin123') {
    return res.json({ message: 'Admin login successful' });
  }
  res.status(401).json({ message: 'Invalid admin credentials' });
});

app.get('/api/admin/employees', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'DB not ready' });

  const employees = await db.collection('employees').find({}).toArray();
  res.json(employees.map(({ password, ...e }) => e));
});

// ===================================================
