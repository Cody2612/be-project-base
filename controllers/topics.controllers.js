const { fetchTopics } = require("../models/topics.models");

exports.getTopics = (request, response, next) => {
    fetchTopics()
    .then((topics)=>{
         response.status(200).send({topics});
         console.log("this is from controller <<<<", {topics});
    })
    .catch(next);
};