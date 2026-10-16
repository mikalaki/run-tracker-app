const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

const runs = [];

app.get("/runs", (req, res) => {
    res.json(runs);
});

app.post("/runs", (req, res) => {
    const { distanceKm, durationMinutes, startedAt } = req.body;

    if (!distanceKm || !durationMinutes || !startedAt) {
        return res.status(400).json({
            error: "distanceKm, durationMinutes and startedAt are required"
        });
    }

    const run = {
        id: runs.length + 1,
        distanceKm,
        durationMinutes,
        startedAt
    };

    runs.push(run);

    res.status(201).json(run);
});

app.listen(port, () => {
    console.log(`Run Tracker Service listening on port ${port}`);
});