const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: { type: String, required: true },
    message: String,
    status: { type: String, default: 'pending' }  // "pending" or "done"
});

// Explicitly define collection name
module.exports = mongoose.model('Query', querySchema, 'contact_queries');
