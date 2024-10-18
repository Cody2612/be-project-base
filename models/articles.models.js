const db = require("../db/connection.js");


exports.fetchArticles = (sort_by ="created_at", order="DESC") =>{
    const sortBy = [
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "comment_count"
    ];

    const orderBy = [
        "ASC", "DESC"
    ]

    if (!sortBy.includes(sort_by)) {
        return Promise.reject({status: 400, msg: "Invalid sort query"})
    }

    if (!orderBy.includes(order.toUpperCase())) {
        return Promise.reject({status: 400, msg: "Invalid order query"})
    }

    let queryString = `
    SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id 
    ORDER BY ${sort_by} ${order} ;`;

    return db.query(queryString)
    .then(({rows}) => {
        return rows;
    });

};