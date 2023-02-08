import jwt from "jsonwebtoken";
import User from "../../model/user";

const updateUserHandler = async (req, resp) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return resp.sendStatus(401);
    }

    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            return resp.sendStatus(401);
        }

        const { id, username, email } = decoded;
        const { toggle, author } = req.body;

        try {
            const result = await User.findOne({ username });
            const { following } = result;

            if (!toggle) {
                const index = following.indexOf(author);
                if (index > -1) {
                    following.splice(index, 1);
                }
            } else {
                const index = following.indexOf(author);
                if (index < 0) {
                    following.push(author);
                }
            }

            try {
                await User.findOneAndUpdate({ username }, { following });
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
                            return resp.status(500).send(err);
                        }

                        return resp.status(200).json({ token });
                    });
            } catch (error) {
                return resp.status(500).send(error);
            }
        } catch (error) {
            return resp.status(500).send(error);
        }
    });
}

export default updateUserHandler;