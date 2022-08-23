const mongoose = require('mongoose')

var url = "mongodb+srv://root:1234567890@cluster0.gbucj.mongodb.net/TodoDatabase?retryWrites=true&w=majority";

module.exports.start = function(){
  mongoose.connect(url).then(function(){
    console.log("DB Connected");
  })
}