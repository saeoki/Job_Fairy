const mongoose = require('mongoose');

const ProblemSchema = mongoose.Schema({
    no: Number,
    title: String,
    type: String,
    description: String,
    testCases: [{ input: String, expectedOutput: String }],
    problem: [Number],
    answer: String,
    level : Number,
});

const Problem = mongoose.model('Problem', ProblemSchema);
module.exports ={ Problem }