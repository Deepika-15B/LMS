const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const userRoutes = require('./routes/users');
const assignmentRoutes = require('./routes/assignments');
const documentRoutes = require('./routes/documents');
const quizRoutes = require('./routes/quizzes');
const meetingRoutes = require('./routes/meetings');

dotenv.config({ path: path.join(__dirname, '../.env') });

require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadPath = path.join(__dirname, 'uploads');
const assignmentPath = path.join(uploadPath, 'assignments');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

if (!fs.existsSync(assignmentPath)) {
  fs.mkdirSync(assignmentPath);
}

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
   'https://lms-cq22.vercel.app'
].filter(Boolean);


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    // allow localhost
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow all vercel deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
   cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/meetings', meetingRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'LEARNIT API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
