require('dotenv').config(); // Load variables from .env

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Query = require('./models/Query');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB Atlas using URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin.html'));
});

app.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!phone) return res.status(400).send('Phone number is required.');
    const query = new Query({ name, email, phone, message });
    await query.save();
    res.send('Query submitted successfully!');
  } catch (err) {
    res.status(500).send('Error saving query');
  }
});

app.get('/queries', async (req, res) => {
  const queries = await Query.find({});
  res.json(queries);
});

app.put('/mark-done/:id', async (req, res) => {
  await Query.findByIdAndUpdate(req.params.id, { status: 'done' });
  res.send('Marked as done');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
