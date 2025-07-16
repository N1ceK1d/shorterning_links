const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const shortid = require('shortid');

require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    database: process.env.mysql_database,
    password: process.env.mysql_password
});

connection.connect((err) => {
    if(err) {
        throw new Error(`У вас ошибка: ${err}`);
    } else {
        console.log('Подключение прошло успешно');
    }
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));

app.post('/shorten', (req, res) => {
    const original_link = req.body.original_link;
    const short_code = shortid.generate();
    connection.query(`INSERT INTO links (original_link, short_link) VALUES ('${original_link}', '${short_code}')`, (err, result) => {
        if(err) {
            throw new Error(`Не удалось выполнить запрос: ${err}`);
        } else {
            console.log("Запрос выполнен успешно");
        }
    });
});

app.get('/:code', (req, res) => {
    connection.query(`SELECT original_link FROM links WHERE short_link = '${req.params.code}'`, (err, result) => {
        if(err) {
            throw new Error(`Не удалось выполнить запрос: ${err}`);
        } else {
            res.redirect(result[0].original_link);
        }
    })
    
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(3000);