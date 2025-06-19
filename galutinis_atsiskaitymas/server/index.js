import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import users from './routes/users.js';
import questions from './routes/questions.js';
import answers from './routes/answers.js';
import likes from './routes/likes.js';

const PORT = process.env.PORT || 5501;
const corsOptions = {
    origin: "http://localhost:5173",
    exposedHeaders: ['Authorization']
};

const app = express();

app.use(express.json());

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

// users
app.use('/users', users);

// questions
app.use('/questions', questions);

// answers
app.use('/questions', answers);

//likes
app.use('/likes', likes)

app.use((req, res) => {
    res.status(404).send({ error: `Your requested route does not exist` });
});