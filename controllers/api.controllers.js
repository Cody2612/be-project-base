exports.getApis = (request, response) =>{
    response.status(200).send({endpoints});
};