import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/user";
import { check, validationResult } from 'express-validator';

export const resetPasswordValidator = [
    check('password').isLength({ min: 8, max: 20 })
        .withMessage('Password must be at least 8 and maximun 20 characters')
        .matches('[0-9]').withMessage('Password must contain a number')
        .matches('[a-z]').withMessage('Password must contain an lowercase Letter')
        .matches('[A-Z]').withMessage('Password must contain an uppercase Letter')
        .trim().escape()
];

export const resetPasswordHandler = async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(422).json({ errors: errors.array() });
    } else {
        const { resetPasswordCode } = req.params;
        const user = await User.findOne({ resetPasswordCode });

        if (!user) {
            return resp.sendStatus(401);
        }

        const { password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await User.findOneAndUpdate({ resetPasswordCode }, { $unset: { resetPasswordCode: 1 }, passwordHash });
        const { _id: id, username, email, following } = result;

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
    }
}