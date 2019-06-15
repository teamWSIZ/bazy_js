"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.use(express.json()); //pozwala na czytanie req.body
app.use((req, res, next) => {
    //konfiguracja CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const Pool = require('pg').Pool;
const pool = new Pool({
    host: '10.10.0.33',
    port: 5432,
    database: 'student',
    user: 'student',
    password: 'wsiz#1234'
});
app.get('/status', (req, res) => {
    res.send('Highscore app works OK');
});
app.get('/scores', (req, res) => {
    pool.query('select * from aa.high order by score desc', (er, re) => {
        if (er)
            throw er;
        res.send(re.rows);
    });
});
app.post('/scores', (req, res) => {
    let m = req.body;
    m.created = new Date();
    if (m.id === undefined) {
        pool.query('INSERT INTO aa.high (alias, score, created) VALUES ($1, $2, $3) ' +
            'returning *', [m.alias, m.score, m.created], (error, response) => {
            if (error) {
                console.log(`error: ${error}`);
                res.send(error);
                return;
            }
            m = response.rows[0];
            res.send(m);
        });
    }
    else {
        console.log(`Updateujemy high score o id=${m.id}`);
        pool.query('UPDATE aa.high SET alias=$2, score=$3, created=$4 where id=$1 ' +
            'returning *', [m.id, m.alias, m.score, m.created], (error, re) => {
            if (error) {
                console.log(`error: ${error}`);
                res.send(error);
                return;
            }
            m = re.rows[0];
            res.send(m);
        });
    }
});
app.delete('/scores/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM aa.high where id=$1 returning *', [id], (error, re) => {
        if (error) {
            console.log(`error: ${error}`);
            res.send(error);
            return;
        }
        console.log(`usunieto ${JSON.stringify(re.rows[0])} elementów`);
        res.send(`OK`);
    });
});
app.listen(3003, function () {
    console.log('Example app listening on port 3003!');
    pool.query('set search_path to aa');
});
/**
 * Tabela highscores:
 * id : SERIAL
 * alias : text
 * score : int
 * created : timestamp
 *
 *
 * Zadanie:
 * 1) stworzyć tabelę na bazie,
 * 2) dodać kilka danych (ręcznie, może być z intellij)
 * 3) na backendzie (ten fajl) dodać metodę zwracającą wrzystkie highscores (można posortować po score, malejąco)
 * 4) na backebdzue dodać metodę dodawania/modyfikacji highscores,
 * 5) dodać metodę usuwania highscores (by id)
 */
