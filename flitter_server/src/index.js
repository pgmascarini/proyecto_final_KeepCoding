import express from 'express';
import routes from './routes';
import mongoose from "mongoose";

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

const app = express();

// This allows us to access the body of POST/PUT
// requests in our route handlers (as req.body)
// request accept until 5mb
app.use(express.json({limit: '5mb', extended: true}));
app.use(express.urlencoded({limit: '5mb', extended: true}));
app.use(express.urlencoded({limit: "5mb", extended: true, parameterLimit:5000}));
app.use(express.text({ limit: '5mb' }));

// create base api router and consume all routes
app.use('/api', routes);

// Connect to the database, then start the server.
// This prevents us from having to create a new DB
// connection for every request.
mongoose.set('strictQuery', false);
mongoose.connect(DB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
