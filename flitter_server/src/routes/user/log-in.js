import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/user";
import { check, validationResult } from 'express-validator';

export const logInValidator = [
    check('username', 'Username is not valid').isLength({ min: 3, max: 20 })
        .withMessage('Username must be at least 8 and maximun 20 characters ')
        .matches(/^[A-Za-z]+$/).withMessage("Username accepts only letters")
        .trim().escape(),
    check('password').isLength({ min: 8, max: 20 })
        .withMessage('Password must be at least 8 and maximun 20 characters')
        .matches('[0-9]').withMessage('Password must contain a number')
        .matches('[a-z]').withMessage('Password must contain an lowercase Letter')
        .matches('[A-Z]').withMessage('Password must contain an uppercase Letter')
        .trim().escape()];

export const logInHandler = async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(422).json({ errors: errors.array() });
    } else {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return resp.sendStatus(401);
        }

        const { _id: id, passwordHash, email, following } = user;
        const isCorrect = await bcrypt.compare(password, passwordHash);
        if (isCorrect) {
            jwt.sign({
                id,
                username,
                email,
                following
            },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }, (err, token) => {
                    if (err) {
                        return resp.sendStatus(500);
                    }

                    return resp.status(200).json({ token });
                });
        } else {
            return resp.sendStatus(401);
        }
    }
};