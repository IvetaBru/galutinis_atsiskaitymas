import { MongoClient } from "mongodb";
import jwt from 'jsonwebtoken';

const DB_CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/`;

export const connectDB = async () => {
    return await MongoClient.connect(DB_CONNECTION_STRING);
}

export const createAccessJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'});
}

export const validateJWT = (provided_JWT) => {
    return new Promise((resolve) => {
        jwt.verify(provided_JWT, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
            if(err){
                resolve({ error: 'Session expired or invalid token'})
            }else{
                resolve(decoded);
            }
        });
    });
};