import express from "express";

const healthRouter = express.Router();

healthRouter.get("/", (req, res) => {
    res.send("OK");
})

export default healthRouter;