import moment from "moment";
import Flitter from "../../model/flitter";

const getFlittersHandler = async (req, resp) => {
    let query = { publicationDate: { $lt: moment().add(1, 'day').format("YYYY-MM-DD") } };
    let perPage = 5;
    const { search, author, page, following } = req.query;

    if (search) {
        query.description = { "$regex": search, "$options": "i" };
    }

    if (author) {
        query.author = author;
    }

    if (following) {
        query.author = { $in: following.split(",") }
    }

    Flitter.countDocuments(query).count((error, total) => {
        Flitter.find(query)
            .skip(perPage * page)
            .limit(perPage)
            .sort({ publicationDate: "desc", _id: 1 })
            .then((results) => {
                const isLastPage = (perPage * (Number(page) + 1)) >= total;
                return resp.status(200).json({ page, isLastPage, flitters: results });
            })
            .catch((err) => {
                return resp.status(500).send(err);
            });

    });
}

export default getFlittersHandler;