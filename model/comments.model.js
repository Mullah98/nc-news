const db = require("../db/connection")
const data = require("../db/data/test-data")

exports.selectComments = (article_id) => {
    const queryString = `SELECT * FROM comments WHERE article_id = $1 
    ORDER BY created_at DESC;`

    return db.query(queryString, [article_id])
    .then((results) => {
        return results.rows
    })
}

exports.insertComment = (article_id, newComment) => {
    const { username, body } = newComment;
    if (!username || !body ) {
        return Promise.reject({ status:400, msg: 'Bad request'})
    }

    return db.query(`INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [username, body, article_id])
    .then((comment) => {
        return comment.rows[0]
    })
}

exports.removeComment = (comment_id) => {
    const queryString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`

    return db.query(queryString, [comment_id])
    .then((results) => {
        if (results.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Comment not found'})
        }
        return results.rows[0]
    })
}