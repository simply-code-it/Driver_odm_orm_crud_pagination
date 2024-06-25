const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {type: String, required:true},
    status: String,
    desc: String
})

module.exports = mongoose.model('Todo', todoSchema);