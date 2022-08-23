const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todo : {
    type : String,
    required : true,
    unique : true
  },

  userID : {
    type : String,
    required : true
  }
});

const todoModel = mongoose.model('todos', todoSchema);

module.exports = todoModel;