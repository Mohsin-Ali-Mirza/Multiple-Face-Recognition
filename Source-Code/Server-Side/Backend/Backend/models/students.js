const mongoose = require('mongoose');
const { Schema } = mongoose;

const Students = new Schema({
    id:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true
    },
    dept:{
        type: String,
        required: true,
    },
     image:{
         type: String,
         default: 'https://e7.pngegg.com/pngimages/277/792/png-clipart-computer-icons-encapsulated-postscript-font-employee-miscellaneous-photography.png'
     },
    attendance:{
        type: Number,
        default:0
    },
    last_attendance:{
        type: Date,
        default: Date.now
    },
    Camera_instance:{
        type: Number,
        default: 0
    }
  });
  const Student = mongoose.model('students', Students);
  module.exports = Student;
