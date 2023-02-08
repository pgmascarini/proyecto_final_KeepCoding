import jwt from "jsonwebtoken";
import User from "../../model/user";
import Flitter from "../../model/flitter";

const unsubscribe = async (req, resp) => {
    const { authorization } = req.headers;
    const { id } = req.params;

    if (!authorization || !id) {
        return resp.sendStatus(401);
    }

    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error || decoded.id !== id) {
            return resp.sendStatus(401);
        }

        try {
            try {
                await Flitter.deleteMany({ author: decoded.username });
                const response = await User.deleteOne({ _id: id });
                return resp.status(200).json(response);
            } catch (error) {
                return resp.status(500).send(error);
            }
        } catch (error) {
            return resp.status(500).send(error);
        }
    });
}

export default unsubscribe;