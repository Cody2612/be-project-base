const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();

app.get("/api/topics", getTopics);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "End point not found" });
});

app.use((error, request, response, next) => {
    response.status(500).send({msg: "Internal Server Error"})
});

module.exports = app;
