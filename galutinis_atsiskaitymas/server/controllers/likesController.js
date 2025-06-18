import { v4 as generateID } from 'uuid';

import { connectDB } from './helper.js';

export const getAllLikes = async (req, res) => {
    const client = await connectDB();
    try{
        const { questionId } = req.params;
        const count = await client
            .db('Final_Project')
            .collection('likes')
            .countDocuments({ questionId });
        res.send({ questionId, likesCount: count });
    }catch(err){
        console.error(err);
        res.status(500).send({ error: err, message: `Something went wrong with server, please try again later.` });
    }finally{
        await client.close();
    }
};

export const toggleLike = async (req, res) => {
    const client = await connectDB();
    try{

    }catch(err){

    }finally{
        await client.close();
    }
};

export const getUserLikes = async (req, res) => {

};