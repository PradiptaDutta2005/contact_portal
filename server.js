const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Query = require('./models/Query');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/contactDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
