import bcrypt from 'bcrypt';

import { connectDB } from "./helper.js"

export const login = async (req, res) => {
    const client = await connectDB();
    try{
        const DB_RESPONSE = await client.db('Final_Project').collection('users').findOne({ username: req.body.username });
        if(!DB_RESPONSE){
            return res.status(404).send({ error: 'No user was found with such name or password'})
        }
        if(!bcrypt.compareSync(req.body.password, DB_RESPONSE.password)){
            return res.status(404).send({ error: 'No user was found with such name or password'})
        }
        const {password, ...restUserInfo} = DB_RESPONSE;
        res.send({ success: 'User successfully logged in', userData: restUserInfo});
    }catch(err){
        res.status(500).send({ error: err, message: 'Something went wrong with server, please try again later'});
    }finally{
        await client.close();
    }
}