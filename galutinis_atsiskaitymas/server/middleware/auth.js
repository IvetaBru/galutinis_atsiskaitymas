import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if(err){
      console.log("JWT error:", err);
      res.status(401).send({ error: 'Your session has expired. Please log in again.' });
    } else {
      req.user = decoded;
      next();
    }
  });
}