const express = require('express');
const router = express.Router();
const db = require('../db');

// get liste postów
router.get('/', (req, res) => {
    db.all(
        'SELECT Id, Title, Body, CreatedAt FROM Posts ORDER BY Id DESC',
        [],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

//get post
router.get('/:id', (req, res) => {
    const id = req.params.id;

    db.get(
        'SELECT Id, Title, Body, CreatedAt FROM Posts WHERE Id = ?',
        [id],
        (err, row) => {
            if (err) return res.status(500).json(err);
            if (!row) {
                return res.status(404).json({ error: 'nie ma takiego posta' });
            }
            res.json(row);
        }
    );
});

//dodanie posta
router.post('/', (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({
            error: 'tytuł i treść wymagana'
        });
    }

    db.run(
        'INSERT INTO Posts(Title, Body) VALUES (?, ?)',
        [title, body],
        function (err) {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                id: this.lastID,
                title,
                body
            });
        }
    );
});

module.exports = router;
