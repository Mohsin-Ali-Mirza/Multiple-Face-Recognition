const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Student = require('../models/students');
const mongoose = require('mongoose');

router.post('/', (req, res) => {
    console.log(req.body);
    const st = Student(req.body);
    st.save();
    res.send(req.body);
});

router.delete('/:id', async (req, res) => {
    const studentId = req.params.id;
  
    try {
      const deletedStudent = await Student.findOneAndDelete({ id: studentId });
  
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json({ message: 'Student deleted successfully', deletedStudent });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
router.put('/:id', async (req, res) => {
  const studentId = req.params.id;
  const { name, dept } = req.body;

  try {
    // Find the student by ID
    const student = await Student.findOne({ id: studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update only the name and dept fields
    student.name = name;
    student.dept = dept;

    // Save the updated student
    const updatedStudent = await student.save();

    res.json({ message: 'Student updated successfully', updatedStudent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  
  

module.exports = router;
