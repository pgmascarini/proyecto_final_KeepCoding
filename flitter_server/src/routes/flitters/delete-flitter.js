import jwt from "jsonwebtoken";
import Flitter from "../../model/flitter";

const deleteFlitterHandler = async (req, resp) => {
    const { authorization } = req.headers;
    const { id } = req.params;

    if (!authorization || !id) {
        return resp.sendStatus(401);
    }

    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            return resp.sendStatus(401);
        }

        const { username } = decoded;

        try {
            const result = await Flitter.findOne({ _id: id });
            const { author } = result;
            if (username !== author) {
                return resp.sendStatus(401);
            }

            try {
                const response = await Flitter.deleteOne({ _id: id });
                return resp.status(200).json(response);
            } catch (error) {
                return resp.status(500).send(error);
            }
        } catch (error) {
            return resp.status(500).send(error);
        }
    });
}

export default deleteFlitterHandler;