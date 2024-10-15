const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();
const { getApis } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/article-id.controllers");

app.get("/api", getApis);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "End point not found" });
});



app.use((error, request, response, next) => {
  if (error.code === "22P02"){
    response.status(400).send({msg: "Invalid Id type"})
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
