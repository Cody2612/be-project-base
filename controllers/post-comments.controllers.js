const { fetchPostCommentByArticleId } = require("../models/post-comments.models");

exports.postCommentsByArticleId = (request, response, next) =>{
    const {article_id} = request.params;
    const {username, body} = request.body;


    if (!body || !username){
        return response.status(400).send({msg: "Missing required fields"})
    }

    fetchPostCommentByArticleId(article_id, username, body)
    .then((comment)=>{
        response.status(201).send({comment});
    })
    .catch(next);
}