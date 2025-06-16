import { v4 as generateID } from 'uuid';

import { connectDB } from './helper.js';

export const getAnswersForQuestion = async (req, res) => {
    const client = await connectDB();
    try{
        const answers = await client
            .db('Final_Project')
            .collection('answers')
            .find({ questionId: req.params.questionId })
            .toArray();
        const users = await client.db('Final_Project').collection('users').find().toArray();
        const usersMap = Object.fromEntries(users.map(user => [user._id, user.username])); 
        const answersWithAuthor = answers.map(answer => ({...answer, authorUsername: usersMap[answer.authorId] || 'Unknown'}));
        res.send(answersWithAuthor);   
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
}

export const addAnswerToQuestion = async (req, res) => {

}

export const deleteAnswer = async (req, res) => {

}

export const editAnswer = async (req, res) => {

}
