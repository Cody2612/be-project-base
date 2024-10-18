const { fetchArticles } = require("../models/articles.models");

exports.getArticles = ( request, response, next) => {
    const {sort_by, order} = request.query;
    fetchArticles(sort_by, order)
    .then((articles)=>{
        response.status(200).send({articles});
    })
    .catch(next);
}