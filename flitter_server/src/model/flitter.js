import mongoose from "mongoose";

const Schema = mongoose.Schema;

const flitterSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    publicationDate: {
        type: Date,
    },
    kudos: {
        type: [String]
    }
}, { timestamps: true });

const Flitter = mongoose.model('Flitter', flitterSchema);

export default Flitter;