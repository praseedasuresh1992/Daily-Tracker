const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();


const app = express();

// Database Connection

const connectDb=require('./config/db');
connectDb();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.listen(process.env.PORT||5000, () => {
  console.log(`Listening at port ${process.env.PORT}`);
});