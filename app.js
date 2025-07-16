const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}))

app.post('/shorten', (req, res) => {
    const original_link = req.body.original_link;
});

app.get('/:code', async (req, res) => {
    await res.redirect(`${req.params.code}`);
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(3000);