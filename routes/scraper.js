const express = require("express");
const router = express.Router();
const { getArticleOfAuthor,getAllAuthorURL,getArticleAll} = require("../scraper/function");

const Author = require('../models/Author.js');
const Article = require('../models/Article.js');

var Articles = []
var Authors = []
var All = []

router.post('/author', (req, res, next) => {

  const authorPromises = Authors.map((author) => {
    const newAuthor = new Author({
      "authorName": author.authorName,
      "department": author.department,
      "subjectArea": author.subjectArea,
      "h_index": author.h_index,
      "image": author.image
    });
    return newAuthor.save();
  });

  Promise.all(authorPromises)
    .then((docs) => res.json(docs))
    .catch((err) => next(err));
});

// router.post('/article', (req, res, next) => {

//   const articlePromises = Articles.map((article) => {
//     const newArticle = new Article({
//       "articleName": article.articleName,
//       "author": article.author,
//       "releaseDate": article.releaseDate,
//       "academicJournal": article.academicJournal,
//       "description": article.description,
//       "url": article.url,
//       "author_id": article.author_id,
//     });
//     return newArticle.save();
//   });

//   Promise.all(articlePromises)
//     .then((docs) => res.json(docs))
//     .catch((err) => next(err));
// });

router.post('/article', (req, res, next) => {

  const articlePromises = Articles.map((article) => {
    return Author.findOne({ author_id: article.author_id }).exec()
      .then((author) => {
        if (!author) {
          throw new Error('Author not found');
        }
        const newArticle = new Article({
          "articleName": article.articleName,
          "author": author._id,
          "releaseDate": article.releaseDate,
          "academicJournal": article.academicJournal,
          "description": article.description,
          "url": article.url,
          "author_id": article.author_id,
        });
        return newArticle.save();
      });
  });

  Promise.all(articlePromises)
    .then((docs) => res.json(docs))
    .catch((err) => next(err));
});

router.get("/article", (req, res) => {
  res.status(200).json({
    Ariticles : Ariticles
  });
});

router.get("/author", (req, res) => {
  res.status(200).json({
    Authors : Authors 
  });
});

router.get("/all", (req, res) => {
  res.status(200).json({
    All : All
  });
});


router.get("/", async (req, res) => {
  const startURL = "https://scholar.google.com/citations?view_op=view_org&org=16635630670053173100&hl=th&oi=io";
  const selectorForURL = "#gsc_sa_ccl > div.gsc_1usr";
  const authorURL = await getAllAuthorURL(selectorForURL, startURL);
  
  const selector = "#gsc_a_b > tr";
  const author = [];
  const all = [];

  for (let i = 0; i < 10; i++) {
    console.log("Author ",i+1," : "+ authorURL[i].name)
    const num = i+1;
    const data = await getArticleOfAuthor(selector, authorURL[i].url, num);
    author.push(data.author);
    all.push(data.all)
  }
  console.log("Finish")

  Ariticles = await getArticleAll()
  Authors = author
  All  = all
  res.status(200).json({
    data : all
  });
});

module.exports = router;
