const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const {
    ExerciseModal,
    ProgramModal,
    ExerciseProgramModal,
} = require("./Model/Model");
const app = express();
const port = process.env.PORT || 4000;

dotenv.config({
    path: "./config.env",
});

const DB = process.env.DATABASE_URL;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/programs", async (req, res) => {
    try {
        const programs = await ProgramModal.find();
        res.status(200).json(programs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/programs", async (req, res) => {
    try {
        const newProgram = await ProgramModal.create({
            name: req.body.name,
        });
        res.status(201).json(newProgram);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.patch("/programs/:programId", async (req, res) => {
    try {
        const updatedProgram = await ProgramModal.findByIdAndUpdate(
            req.params.programId,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json(updatedProgram);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/programs/:programId", async (req, res) => {
    try {
        const program = await ProgramModal.findByIdAndDelete(req.params.programId);
        res.status(200).json({ message: "program deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/programs/:programId/exercises/:exerciseId", async (req, res) => {
    const { programId, exerciseId } = req.params;
    try {
        const program = await ProgramModal.findById(programId);
        const exercise = await ExerciseModal.findById(exerciseId);
        const exerciseProgram = await ExerciseProgramModal.create({
            program_id: program._id,
            exercise_id: exercise._id,
        });
        res.status(201).json(exerciseProgram);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get("/programs/:programId/exercises", async (req, res) => {
    const { programId } = req.params;
    try {
        const exercises = await ExerciseProgramModal.find({ program_id: programId })
            .populate("exercise_id")
            .exec();
        res.status(200).json(exercises);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/exercises", async (req, res) => {
    try {
        const exercises = await ExerciseModal.find();
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/exercises", async (req, res) => {
    try {
        const newExcercise = await ExerciseModal.create({
            name: req.body.name,
            duration: req.body.duration,
        });
        res.status(201).json(newExcercise);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete("/exercises/:exerciseId", async (req, res) => {
    try {
        const exercise = await ExerciseModal.findByIdAndDelete(
            req.params.exerciseId
        );
        res.status(200).json({ message: "exercise deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log("server is started and running on port", port);
});
