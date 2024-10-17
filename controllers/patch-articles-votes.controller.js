const { updateArticleVotes } = require("../models/patch-articles-votes.models");


exports.patchArticleByID =(request, response, next)=>{
    const {article_id} = request.params;
    const {inc_votes} = request.body;

    if (!inc_votes){
        return response.status(400).send({msg: "Missing required fields"})
    }

    updateArticleVotes(article_id, inc_votes)
    .then(updatedArticle =>{
        response.status(200).send({article: updatedArticle});
    })
    .catch(next);
    
}