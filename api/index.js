const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;

/** Connect mongo db */
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb.");
    } catch (error) {
        // handleError(error)
        throw error;
    }
};
mongoose.connection.on("connected", () => { console.log("Database connected.") });
mongoose.connection.on("disconnected", () => { console.log("Database disconnected.") });


/** middlewares */
app.use(express.json());

/** routes */
app.use('/users', require('./routes/users'));

app.listen(port, () => {
    connect();
    console.log(`Server listening on port ${port}`);
})