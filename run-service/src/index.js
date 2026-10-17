const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());

const mongoHost = process.env.MONGO_HOST || "localhost";
const statisticsServiceUrl =
    process.env.STATISTICS_SERVICE_URL || "http://localhost:3001";

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

app.get("/statistics", async (req, res) => {
    try {
        const runs = await Run.find();

        const response = await fetch(
            `${statisticsServiceUrl}/statistics`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ runs })
            }
        );

        if (!response.ok) {
            return res.status(502).json({
                error: "Statistics service failed"
            });
        }

        const statistics = await response.json();

        res.json(statistics);
    } catch (error) {
        console.error("Failed to get statistics:", error);

        res.status(500).json({
            error: "Failed to get statistics"
        });
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