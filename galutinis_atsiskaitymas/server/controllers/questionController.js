import { v4 as generateID } from 'uuid';

import { connectDB } from './helper.js';

export const getAllQuestions = async (req, res) => {
    const client = await connectDB();
    try{
        const questions = await client
            .db('Final_Project')
            .collection('questions')
            .find()
            .sort()
            .toArray();
        const users = await client.db('Final_Project').collection('users').find().toArray();
        const usersMap = Object.fromEntries(users.map(user => [user._id, user.username])); 
        const questionsWithAuthor = questions.map(q => ({...q, authorUsername: usersMap[q.authorId] || 'Unknown'}));
        res.send(questionsWithAuthor);   
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
};

export const getSpecQuestion = async (req, res) => {
    const client = await connectDB();
    try{
        const { _id } = req.params;
        const question = await client
        .db('Final_Project')
        .collection('questions')
        .findOne({ _id: _id });

        if(!question){
            return res.status(404).send({ error: `Question with id ${_id} not found.`});
        }
        res.json(question);
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
}

export const addNewQuestion = async (req, res) => {

}

export const deleteQuestion = async (req, res) => {

}

export const editQuestion = async (req, res) => {

}