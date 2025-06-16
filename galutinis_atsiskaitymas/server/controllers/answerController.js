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
    const client = await connectDB();
    try{
        const newAnswer = {
            _id: generateID(),
            body: req.body.body,
            authorId: req.user._id,
            questionId: req.params.questionId,
            createdAt: new Date(),
            updatedAt: new Date(),
            isEdited: false
        };
        await client
            .db('Final_Project')
            .collection('answers')
            .insertOne(newAnswer);

        await client
            .db('Final_Project')
            .collection('questions')
            .updateOne(
                { _id: req.params.questionId },
                { $inc: { answersCount: 1 } }
            );

        const user = await client
            .db('Final_Project')    
            .collection('users')
            .findOne({ _id: req.user._id });

        const newAnswerWithUsername = {
            ...newAnswer,
            authorUsername: user?.username || 'Unknown'
        };
        res.send({ success: 'Answer successfully added', newAnswer: newAnswerWithUsername });
    }catch(err){
        console.log(err);
        res.status(500).send({ error: err.message, message: `Something went wrong with servers, please try again later.` });
    }finally{
        await client.close();
    }
}

export const deleteAnswer = async (req, res) => {

}

export const editAnswer = async (req, res) => {

}
