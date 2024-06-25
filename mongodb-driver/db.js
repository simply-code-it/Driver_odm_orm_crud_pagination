const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const database = new MongoClient(url);

module.exports = database;