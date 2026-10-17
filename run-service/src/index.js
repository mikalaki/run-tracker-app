const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());

const mongoHost = process.env.MONGO_HOST || "localhost";

const runSchema = new mongoose.Schema({
    distanceKm: {
        type: Number,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    startedAt: {
        type: Date,
        required: true
    }
});

const Run = mongoose.model("Run", runSchema);

app.get("/runs", async (req, res) => {
    try {
        const runs = await Run.find();
        res.json(runs);
    } catch (error) {
        console.error("Failed to get runs:", error);
        res.status(500).json({ error: "Failed to get runs" });
    }
});

app.post("/runs", async (req, res) => {
    const { distanceKm, durationMinutes, startedAt } = req.body;

    if (!distanceKm || !durationMinutes || !startedAt) {
        return res.status(400).json({
            error: "distanceKm, durationMinutes and startedAt are required"
        });
    }

    try {
        const run = new Run({
            distanceKm,
            durationMinutes,
            startedAt
        });

        await run.save();

        res.status(201).json(run);
    } catch (error) {
        console.error("Failed to create run:", error);
        res.status(500).json({ error: "Failed to create run" });
    }
});

mongoose.connect(`mongodb://${mongoHost}:27017/runtracker`)
    .then(() => {
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Run Tracker Service listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });