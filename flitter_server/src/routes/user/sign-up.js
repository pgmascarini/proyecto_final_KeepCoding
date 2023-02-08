import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/user";
import { check, validationResult } from 'express-validator';

export const signUpValidator = [
    check('username', 'Username is not valid').isLength({ min: 3, max: 20 })
        .withMessage('Username must be at least 8 and maximun 20 characters')
        .matches(/^[A-Za-z]+$/).withMessage("Username accepts only letters")
        .trim().escape(),
    check('email', 'Not valid email').isEmail().trim().escape().normalizeEmail(),
    check('password').isLength({ min: 8, max: 20 })
        .withMessage('Password must be at least 8 and maximun 20 characters')
        .matches('[0-9]').withMessage('Password must contain a number')
        .matches('[a-z]').withMessage('Password must contain an lowercase Letter')
        .matches('[A-Z]').withMessage('Password must contain an uppercase Letter')
        .trim().escape()];

export const signUpHandler = async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(422).json({ errors: errors.array() });
    } else {
        const { username, email, password } = req.body;
        const user = await User.findOne({ '$or': [{ username }, { email }] });

        if (user) {
            return resp.sendStatus(409);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await User.create({
            username,
            email,
            passwordHash
        });

        const { _id: id } = result;
        jwt.sign({
            id,
            username,
            email
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }, (err, token) => {
                if (err) {
                    return resp.status(500).send(err);
                }

                return resp.status(200).json({ token });
            });
    }
}