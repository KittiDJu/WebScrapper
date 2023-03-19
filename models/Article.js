const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    articleName: String,
    author: String,
    releaseDate: String,
    academicJournal: String,
    description: String,
    url: String,
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authors'
    }

})
module.exports = mongoose.model('Article', ArticleSchema)