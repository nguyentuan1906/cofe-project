const express = require('express');
const app = express();
const cookies = require("cookie-parser");
app.use(cookies());
app.get('/', (req, res) => {
    res.send('hello from simple server :)')
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT;
app.listen(port, () => console.log('> Server is up and running on port : ' + port));
const mongoose = require('mongoose');
const colors = require('colors');
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log('> Connected...'.bgCyan))
    .catch(err => console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red))
const categoryRoute = require("./routers/categoryRoute");
const userRouter = require("./routers/userRoute");
app.use("/user", userRouter);
app.use("/category", categoryRoute)


