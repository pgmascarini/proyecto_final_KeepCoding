const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/flitters_db');

const users = require("./users.json");
const flitters = require("./flitters.json");

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
    following: {
        type: [String]
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

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

async function initFlitters() {
    const deleteTable = await Flitter.deleteMany({});
    if (deleteTable) {
        const insertTable = await Flitter.insertMany(flitters);
        if (insertTable) {
            console.log('Flitters loaded');
        } else {
            console.log('Error: it was not possible to load Flitters');
        }
    } else {
        console.log('Error: cannot clean flitters collection.');
    }
}

async function initUsers() {
    const deleteTable = await User.deleteMany({});
    if (deleteTable) {
        const insertTable = await User.insertMany(users);
        if (insertTable) {
            console.log('Users loaded');
            initFlitters();
        } else {
            console.log('Error: it was not possible to load Users');
        }
    } else {
        console.log('Error: cannot clean users collection.');
    }
}

function initDB() {
    initUsers();
}

initDB();