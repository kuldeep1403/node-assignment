const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
    name: String,
});

const exerciseSchema = new mongoose.Schema({
    name: String,
    duration: Number,
});

const exerciseProgramSchema = new mongoose.Schema({
    exercise_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExerciseModal",
    },
    program_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramModal",
    },
});

const ExerciseModal = mongoose.model("ExerciseModal", exerciseSchema);
const ProgramModal = mongoose.model("ProgramModal", programSchema);
const ExerciseProgramModal = mongoose.model(
    "ExerciseProgramModal",
    exerciseProgramSchema
);

module.exports = { ExerciseModal, ProgramModal, ExerciseProgramModal };
