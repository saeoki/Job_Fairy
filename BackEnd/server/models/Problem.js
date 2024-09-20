const mongoose = require('mongoose');

const ProblemSchema = mongoose.Schema({
    no: Number,
    title: String,
    type: String,
    inputType : [String],
    outputType : [String],
    description: String,
    testCases: [{ input: [String], expectedOutput: String }],
    problem: [Number],
    answer: String,
    level : Number,
    params: [String],
});

const Problem = mongoose.model('Problem', ProblemSchema);
module.exports ={ Problem }