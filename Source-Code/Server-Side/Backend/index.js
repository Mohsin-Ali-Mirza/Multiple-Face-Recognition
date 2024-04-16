const connectToMongo = require('./db');
const Student = require('./models/students');
const mongoose = require('mongoose');
const express = require('express')
const multer  = require('multer');
const upload = multer();
const axios = require('axios');
var cors = require('cors')




connectToMongo();
const app = express()
const port = 5000
app.use(cors())
app.use(upload.array());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})




app.post('/register', async (req, res) => {
  try {
    const { name, dept, id } = req.body;

    const newStudent = new Student({ id, name, dept });

    const savedStudent = await newStudent.save();

    // Send the response to the client
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error while saving data' });
  }
});


app.use('/api/auth', require('./routes/auth'))
app.use('/api/student', require('./routes/student'))
app.use('/api/student/fetchallstudents', require('./routes/student'))

app.listen(port, () => {
  console.log(`FYP backend listening at http://localhost:${port}`)
})