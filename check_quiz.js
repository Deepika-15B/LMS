const mongoose = require('mongoose');
const Quiz = require('./server/models/Quiz');
require('dotenv').config({ path: './.env' });

async function checkQuiz() {
  try {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI not found in .env');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const quiz = await Quiz.findOne({ title: /Mongodb/i });
    if (!quiz) {
      console.log('Quiz not found');
    } else {
      console.log('Quiz Title:', quiz.title);
      quiz.questions.forEach((q, i) => {
        console.log(`Question ${i + 1}: ${q.questionText}`);
        console.log(`- Options: ${q.options.join(', ')}`);
        console.log(`- Correct Answer Index: ${q.correctAnswer} (Type: ${typeof q.correctAnswer})`);
      });
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkQuiz();
