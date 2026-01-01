const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/api/posts', require('./routes/posts'));
app.use('/api', require('./routes/comments'));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
