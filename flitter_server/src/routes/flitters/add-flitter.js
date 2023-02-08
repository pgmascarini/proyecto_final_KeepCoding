import jwt from "jsonwebtoken";
import Flitter from "../../model/flitter";
import moment from "moment";
import { check, validationResult } from 'express-validator';

export const addFlitterValidator = [
    check('description', 'Description is not valid').isLength({ max: 256 })
        .withMessage('Description must be at maximun 256 characters')
        .trim().escape(),
    check('publicationDate').isISO8601().toDate().trim().escape()];

export const addFlitterHandler = async (req, resp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(422).json({ errors: errors.array() });
    } else {
        const { authorization } = req.headers;

        if (!authorization) {
            return resp.sendStatus(401);
        }

        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) {
                return resp.sendStatus(401);
            }

            const { username } = decoded;
            const { description, image, publicationDate } = req.body;

            const currentDate = moment().subtract(1, 'day');
            const isPublicationDateAfter = moment(publicationDate).isAfter(currentDate);
            if (!isPublicationDateAfter || (!description && !image)) {
                return resp.sendStatus(422);
            }

            const result = await Flitter.create({
                author: username,
                description,
                image,
                publicationDate
            });

            return resp.status(200).json(result);
        });
    }
}