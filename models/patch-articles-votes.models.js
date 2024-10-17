const db = require("../db/connection.js");

exports.updateArticleVotes = (article_id, inc_votes) => {
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`, [inc_votes, article_id])
        .then(({rows}) => {
            console.log("Rows returned from DB:", rows);
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg:"Article not found"});
            }
            return rows[0];
        })
}