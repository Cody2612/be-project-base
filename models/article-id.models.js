const db = require("../db/connection");

exports.fetchArticleByID= (article_id) => {
    
    const queryString =
        `SELECT 
            articles.author, 
            articles.title, 
            articles.article_id, 
            articles.body, 
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`;
        
    return db.query(queryString, [article_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg:"Article not found"});
        }
        return rows[0];
    })
};