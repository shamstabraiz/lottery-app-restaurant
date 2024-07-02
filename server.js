import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { exec } from "child_process";
import router from "./src/Routes/V1/route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to the database");
}).catch((err) => {
    console.error("Error connecting to the database", err);
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(bodyParser.json());
app.use("*", cors());

app.use('/', router);


/**
 * This route is used to check the health of the server
 * It returns a simple "OK" message
*/
app.get("/health", (req, res) => {
    res.send("OK");
});

app.post("/deploy", (req, res) => {
    exec("./deploy.sh", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
    res.status(200).send("Deploying");
});



app.listen(3500, function () {
    console.log("server running on PORT 3000");
});

