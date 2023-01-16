const mongoose = require('mongoose');

const LinksSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  long_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  count: {
    type: Number,
  },
});

const Links = mongoose.model('Link', LinksSchema);

module.exports = { Links };
