const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/tuition', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
const classRoutes = require('./routes/classes');
app.use('/api/classes', classRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
