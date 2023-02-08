import jwt from "jsonwebtoken";
import Flitter from "../../model/flitter";

const updateFlitterHandler = async (req, resp) => {
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
        const { user } = req.body;
        if (user && user !== username) {
            return resp.sendStatus(403);
        }

        try {
            const result = await Flitter.findOne({ _id: id });
            const { author, kudos } = result;
            if (!user) {
                const index = kudos.indexOf(username);
                if (index > -1) {
                    kudos.splice(index, 1);
                }
            } else {
                const index = kudos.indexOf(username);
                if (index < 0 && username !== author) {
                    kudos.push(username);
                }
            }

            try {
                const response = await Flitter.findOneAndUpdate({ _id: id }, { kudos });
                return resp.status(200).json(response);
            } catch (error) {
                return resp.status(500).send(error);
            }
        } catch (error) {
            return resp.status(500).send(error);
        }
    });
}

export default updateFlitterHandler;