const mongoose = require("mongoose")

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
    // required: true
  },
  created_at: {
    type: Date,
    //  required: true
  },
  count: {
    type: Number,
    // required: true
  }
})

const Links = mongoose.model('Link', LinksSchema)

module.exports = { Links }