const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();


const app = express();

// Database Connection

const connectDb=require('./config/db');
connectDb();

// CORS 
const corsOptions = {
  origin: [
    'http://localhost:5173'
  ],
  credentials: true,  // 🔥 VERY IMPORTANT
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use("/api/categories", require('./routes/categoryRoutes'));

app.listen(process.env.PORT||5000, () => {
  console.log(`Listening at port ${process.env.PORT}`);
});