import bcrypt from 'bcrypt';
import { v4 as generateID } from 'uuid';

import { connectDB, createAccessJWT, validateJWT } from "./helper.js"

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
        const JWT_accessToken = createAccessJWT(restUserInfo);
        res
        .header('Authorization', JWT_accessToken)
        .send({ success: 'User successfully logged in', userData: restUserInfo, accessJWT: JWT_accessToken});
    }catch(err){
        res.status(500).send({ error: err, message: 'Something went wrong with server, please try again later'});
    }finally{
        await client.close();
    }
};

export const loginAuto = async (req, res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).send({ error: 'Authorization header missing or invalid' });
    }
    const accessToken = authHeader.split(' ')[1];
    const verifyResults = await validateJWT(accessToken);
    if('error' in verifyResults){
        //res su error message(turi fronte neprijungti - navigate į login)
        res.status(400).send(verifyResults);
    }else{
        //res su body, kur yra decoded info ir fronte vartotojas automatiškai prijungiamas
        res.send(verifyResults);
    }
}

export const register = async (req, res) => {
    const client = await connectDB();
    try{
        const DB_RESPONSE = await client.db('Final_Project').collection('users').findOne({ username: req.body.username });
        if(DB_RESPONSE){
            return res.status(400).send({ error: 'Username is already taken'});
        }
        const emailCheck = await client.db('Final_Project').collection('users').findOne({ email: req.body.email });
        if(emailCheck){
            return res.status(400).send({ error: 'A user with this email already exists'});
        }
        const newUser = {
            _id: generateID(),
            username: req.body.username,
            fullName: req.body.fullName,
            email: req.body.email,
            avatar: req.body.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
            password: bcrypt.hashSync(req.body.password, 10),
            createdAt: new Date().toISOString()
        }
        await client.db('Final_Project').collection('users').insertOne(newUser);
        const { password, ...restUserInfo} = newUser;
        const JWT_accessToken = createAccessJWT(restUserInfo);
        res
            .header('Authorization', JWT_accessToken)
            .send({ success: 'User registered and logged in successfully', userData: restUserInfo });
    }catch(err){
        res.status(500).send({ error: err, message: 'Something went wrong with server, please try again later'});
    }finally{
        await client.close();
    }
};