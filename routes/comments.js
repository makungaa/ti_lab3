
const express = require('express');
const router = express.Router();
const db = require('../db');

//zwraca liste zatwierdzonych komentarzy
router.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;

    db.all(
        `
    SELECT Id, Author, Body, CreatedAt
    FROM Comments
    WHERE PostId = ? AND Approved = 1
    ORDER BY Id DESC
    `,
        [postId],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

//dodanie komentarza
router.post('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    const { author, body } = req.body;

    if (!author || !body) {
        return res.status(400).json({
            error: 'autor i tresc sa wymagane'
        });
    }

    // sprawdź czy post istnieje
    db.get(
        'SELECT Id FROM Posts WHERE Id = ?',
        [postId],
        (err, post) => {
            if (err) return res.status(500).json(err);
            if (!post) {
                return res.status(404).json({ error: 'Post nie istnieje' });
            }

            db.run(
                `
        INSERT INTO Comments(PostId, Author, Body)
        VALUES (?, ?, ?)
        `,
                [postId, author, body],
                function (err) {
                    if (err) return res.status(500).json(err);

                    res.status(201).json({
                        id: this.lastID,
                        post_id: postId,
                        author,
                        body,
                        approved: 0
                    });
                }
            );
        }
    );
});

//zatwierdzenie komentarza (moderacja)
router.post('/comments/:id/approve', (req, res) => {
    const id = req.params.id;

    db.run(
        'UPDATE Comments SET Approved = 1 WHERE Id = ?',
        [id],
        function (err) {
            if (err) return res.status(500).json(err);

            if (this.changes === 0) {
                return res.status(404).json({
                    error: 'nie znaleziony komentarz'
                });
            }

            res.json({
                message: 'komentarz zatwierdzony'
            });
        }
    );
});

//lista niezatwierdzonych komentarzy
router.get('/comments/pending', (req, res) => {
    db.all(
        `
    SELECT Id, PostId, Author, Body, CreatedAt
    FROM Comments
    WHERE Approved = 0
    ORDER BY Id DESC
    `,
        [],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

module.exports = router;
