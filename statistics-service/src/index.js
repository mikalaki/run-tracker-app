const express = require("express");

const app = express();
const port = 3001;

app.use(express.json());

app.post("/statistics", (req, res) => {
    const runs = req.body.runs;

    if (!Array.isArray(runs)) {
        return res.status(400).json({
            error: "runs must be an array"
        });
    }

    const numberOfRuns = runs.length;

    const totalDistanceKm = runs.reduce(
        (total, run) => total + run.distanceKm,
        0
    );

    const totalDurationMinutes = runs.reduce(
        (total, run) => total + run.durationMinutes,
        0
    );

    const totalRunPace = runs.reduce(
        (total, run) => total + (run.durationMinutes / run.distanceKm),
        0
    );

    const averageRunPaceMinPerKm =
        numberOfRuns > 0
            ? totalRunPace / numberOfRuns
            : 0;

    res.json({
        numberOfRuns,
        totalDistanceKm,
        totalDurationMinutes,
        averageRunPaceMinPerKm
    });
});

app.listen(port, () => {
    console.log(`Statistics Service listening on port ${port}`);
});