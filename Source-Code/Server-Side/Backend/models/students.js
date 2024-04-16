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
    // image:{
    //     type: String,
    //     required: true
    // },
    attendance:{
        type: Number,
        default:0
    },
    last_attendance:{
        type: Date,
        default: Date.now
    },
  });
  const Student = mongoose.model('students', Students);
  module.exports = Student;
