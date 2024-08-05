//Authorization
//things logged in users can do and non-logged in users can't

import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization"); //grabbing the key from frontend

        if(!token) {
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); //to execute the next function

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}