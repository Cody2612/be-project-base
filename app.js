const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();
const { getApis } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/article-id.controllers");
const { getArticles } = require("./controllers/articles.controllers");
const { getCommentsByArticleId } = require("./controllers/comments.controllers");
const { postCommentsByArticleId } = require("./controllers/post-comments.controllers");
const { patchArticleByID } = require("./controllers/patch-articles-votes.controller");

app.use(express.json());

app.get("/api", getApis);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticleByID);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "End point not found" });
});

app.use((error, request, response, next) => {
  if (error.code === "22P02"){
    response.status(400).send({msg: "Invalid Id type"})
  }
  if (error.code === "23503") {
    response.status(400).send({msg: "Invalid data type"})
  }
  next(error);
});

app.use((error, request, response, next) => {
  if (error.status && error.msg){
    response.status(error.status).send({msg: error.msg})
  }
  next(error);
});

app.use((error, request, response, next) => {
    response.status(500).send({msg: "Internal Server Error"})
});

module.exports = app;
