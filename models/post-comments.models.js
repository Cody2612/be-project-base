const db = require("../db/connection.js");

exports.fetchPostCommentByArticleId = (article_id, username, body) =>{

    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1;`,[article_id])
        .then((result) =>{
            if (result.rows.length === 0){
                return Promise.reject({status: 404, msg: "Article not found"});
            };
            return db.query(`
                INSERT INTO comments(author, body, article_id)
                VALUES($1, $2, $3)
                Returning *;`,[username, body, article_id])
                .then(({rows})=> rows[0])
        })
        
    }