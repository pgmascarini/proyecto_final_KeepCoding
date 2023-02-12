import { v4 as uuid } from "uuid";
import User from "../../model/user";
import sendEmail from "../../utils/send-email";
import { check, validationResult } from 'express-validator';

export const forgotPasswordValidator = [
    check('email', 'Not valid email').isEmail().trim().escape().normalizeEmail()
];

export const forgotPasswordHandler = async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(422).json({ errors: errors.array() });
    } else {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return resp.sendStatus(401);
        }

        try {
            const resetPasswordCode = uuid();
            await User.findOneAndUpdate({ email }, { resetPasswordCode });
            await sendEmail({
                to: email,
                from: "flitter@flitter.com",
                subject: "Flitter password recovery instructions",
                text: `Haga click en el enlace para recuperar tu contraseña: http://localhost:3000/reset-password/${resetPasswordCode}`
            });

            resp.sendStatus(200);
        } catch (error) {
            resp.sendStatus(500);
        }
    }
}