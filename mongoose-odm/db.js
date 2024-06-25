const mongoose = require('mongoose');

async function getDb(db_url) {
    const db = await mongoose.connect(db_url);
    return db;
}

module.exports = getDb;