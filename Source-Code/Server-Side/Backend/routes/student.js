const express = require('express');
const router = express.Router();
const Student = require('../models/students');
const fs = require('fs');
const path = require('path');



router.get('/fetchallstudents', async (req, res) => {
    try {
        // Fetch students from MongoDB
        const students = await Student.find();

        // Log the fetched students to the console
        console.log(students);

        // Send the list of students as a JSON response
        res.json(students);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
