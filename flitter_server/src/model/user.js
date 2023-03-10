import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    resetPasswordCode: {
        type: String,
    },
    following: {
        type: [String]
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;