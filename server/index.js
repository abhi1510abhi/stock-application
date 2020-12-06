
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const cron = require("node-cron");
require('dotenv/config');
const logger = require('pino')();

const { stockCurrentValue } = require('./cron/stockCurrentValue');
const serviceRouter = require("./routes/serviceRoute");

const app = express()
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: '*',
    }
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/action', serviceRouter);

io.on("connection", (socket) => {
    logger.info("user is connected");

    setInterval(async () => {
        const data = await stockCurrentValue();
        socket.emit("response", data);
        return data;
    }, 4000);


})


mongoose.connect(process.env.MONGODB_URI).then(() => {
    logger.info("Connected to database");
}).catch((err) => {
    logger.error(`Error while connecting to db ${err}`);
});


http.listen(port, () => {
    logger.info(`Server is running at port ${port}`);
})