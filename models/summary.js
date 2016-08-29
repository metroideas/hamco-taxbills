var mongoose = require('mongoose');

var summarySchema = mongoose.Schema({
  _id:  { type: String, required: true },
  name: String,
  type: String, 
  taxbills: Array
});

var Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;