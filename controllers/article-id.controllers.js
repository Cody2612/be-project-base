const { fetchArticleByID } = require("../models/article-id.modeles");

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params;
    fetchArticleByID(article_id).then((article)=>{
        response.status(200).send({article})
    })
    .catch(next);
};