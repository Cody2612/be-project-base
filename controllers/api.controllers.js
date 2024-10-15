const endpoints = require("../endpoints.json");

exports.getApis = (request, response) =>{
    response.status(200).send({endpoints});
};