const { deleteFetchCommentById } = require("../models/delete-comments.models");



exports.deleteCommentById =(request, response, next)=>{
    const {comment_id} = request.params;

    if (!comment_id){
        return response.status(400).send({msg: "Missing required fields"})
    }

    deleteFetchCommentById(comment_id)
    .then(() =>{
        response.status(204).send();
    })
    .catch(next);
    
}