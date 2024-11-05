const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // To allow requests from your frontend

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve the HTML form
});




// MongoDB connection


// Replace your connection string with the actual URI
mongoose.connect('mongodb://localhost:27017/studentSurvey')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
// Create Survey Schema for different categories
const surveySchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    city: String,
    category: String, // student, parent, teacher
    educationPerception: String, // Common field for all
    additionalQuestions: mongoose.Schema.Types.Mixed // Storing dynamic fields (for different questions per category)
});

// Model
const Survey = mongoose.model('Survey', surveySchema);

// Handling form submission (student, parent, teacher)
app.post('/submit-survey', async (req, res) => {
    try {
        const { name, gender, age, city, category, educationPerception, ...additionalQuestions } = req.body;
        
        const surveyData = new Survey({
            name,
            gender,
            age,
            city,
            category,
            educationPerception,
            additionalQuestions // Save other dynamic questions (varies by category)
        });

        await surveyData.save(); // Save the data to MongoDB
        res.status(200).send('Survey submitted successfully!');
    } catch (error) {
        res.status(500).send('Error saving survey data: ' + error.message);
    }
});

// Server start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
