
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const cron = require("node-cron");

const { stockCurrentValue } = require('./cron/stockCurrentValue');
const serviceRouter = require("./routes/serviceRoute");

const app = express()
const port = 3000;
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
    console.log("user is connected")

    // cron.schedule("* * * * *", async () => {

    //     const data = await stockCurrentValue();
    //     socket.emit("response", data);

    // });

    setInterval(async () => {
        const data = await stockCurrentValue();
        socket.emit("response", data);
        return data;
    }, 4000);


})


mongoose.connect('mongodb://test:Dustor@cluster0-shard-00-00.kha2i.mongodb.net:27017,cluster0-shard-00-01.kha2i.mongodb.net:27017,cluster0-shard-00-02.kha2i.mongodb.net:27017/stock-db?ssl=true&replicaSet=atlas-v6qat1-shard-0&authSource=admin&retryWrites=true&w=majority').then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});


http.listen(port, () => {
    console.log("server is running");
})