"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
const express = require("express");
const user_1 = require("./user");
const log4js = require("log4js");
const log = log4js.getLogger('Controller');
log.level = 'debug';
//rest calls
const request = require("request");
// Create a new express application instance
const app = express();
app.use(express.json()); //pozwala na czytanie req.body
//pg; https://node-postgres.com
const Pool = require('pg').Pool;
const pool = new Pool({
    host: '10.10.0.33',
    port: 5432,
    database: 'student',
    user: 'student',
    password: 'wsiz#1234'
});
app.get('/count', (req, res) => {
    pool.query('select count(*) from aa.x', (err, response) => {
        if (err)
            throw err;
        console.log(response);
        res.send(response.rows);
    });
});
//todo:
//  - modules
//  - separate controllers for each entity
/// CHAMPIONS
app.get('/champions', (req, res) => {
    pool.query('select * from aa.champions order by id', (er, re) => {
        if (er)
            throw er;
        res.send(re.rows);
    });
});
//// MESSAGES
//podstawowe 3 metody
// wszystkie message w systemie
app.get('/messages', (req, res) => {
    pool.query('select * from aa.messages order by id', (error, response) => {
        if (error)
            throw error;
        res.send(response.rows);
    });
});
// "UPSERT" message (czyli insert jesli nie ma id, i update jesli jest id)
app.post('/messages', (req, res) => {
    let m = req.body; //to przyszło w zapytaniu http w sekcji body (JSON)
    if (m.id === undefined) {
        pool.query('INSERT INTO aa.messages (title, content) VALUES ($1, $2) returning *', [m.title, m.content], (error, response) => {
            //ta operacja zapisała message na bazie, i nadała mu "id";
            //pełny zapisany obiekt został zwrócony -- wysyłamy go klientowi,
            //żeby wiedział jakie "id" ma jego zapisany message
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
        console.log(`Updateujemy message o id=${m.id}`);
        // tu obiekt ma już ID; trzeba więc zrobić update wszystkich pól
        pool.query('UPDATE aa.messages SET title=$2, content=$3 where id=$1 returning *', [m.id, m.title, m.content], (error, re) => {
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
app.delete('/messages/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM aa.messages where id=$1 returning *', [id], (error, re) => {
        if (error) {
            console.log(`error: ${error}`);
            res.send(error);
            return;
        }
        console.log(`usunieto ${JSON.stringify(re.rows[0])} elementów`);
        res.send(`OK`);
    });
});
//dodatkowe
app.get('/messages/search', (req, res) => {
    const searchedTitle = `%${req.query.title}%`;
    pool.query('SELECT * FROM aa.messages WHERE title LIKE $1 ORDER BY id', [searchedTitle], (error, response) => {
        if (error)
            throw error;
        res.send(response.rows);
    });
});
//// USERS
app.get('/users', (req, res) => {
    pool.query('select * from aa.x order by name', (er, re) => {
        if (er)
            throw er;
        res.send(re.rows);
    });
});
app.get('/users/:userid', (req, res) => {
    pool.query('select * from aa.x where id=$1 order by name', [req.params.userid], (er, re) => {
        if (er)
            throw er;
        res.send(re.rows);
    });
});
app.get('/users/create/:name', (req, res) => {
    console.log('creating user with name:' + req.params.name);
    pool.query('INSERT INTO aa.x (name) VALUES ($1) returning id', [req.params.name], (er, re) => {
        if (er)
            throw er;
        console.log('done');
        res.send(re.rows);
    });
});
//upsert user (insert jeśli nowy, update jeśli istniejący)
app.post('/users', (req, res) => {
    let user = req.body;
    console.log(`User: ${user}`);
    if (user.id === undefined) {
        console.log('inserting');
        pool.query('INSERT INTO aa.x (name) VALUES ($1) returning id', [user.name], (e, re) => {
            user.id = re.rows[0].id;
            console.log(`Returning ${JSON.stringify(user)}`);
            res.send(user);
        });
    }
    else {
        console.log('updating');
        res.send('OK');
    }
});
app.get('/now', (q, s) => {
    pool.query('select now()', (e, r) => {
        if (e)
            s.send(e);
        s.send(r.rows);
    });
});
app.get('/hello', (req, res) => {
    const name = req.query.name;
    res.send('Hello ' + name + ' !');
});
app.get('/', function (req, res) {
    let u = new user_1.User('Abra', 'Kadabras');
    res.send('Hello World!' + JSON.stringify(u));
});
app.get('/add', function (req, res) {
    let a = parseInt(req.query.a);
    let b = parseInt(req.query.b);
    res.send('wynik=' + (a + b));
});
app.get('/sensor-count', function (req, res) {
    request.get('http://10.10.0.55:7777/devices', (e, rez, body) => {
        res.send(JSON.parse(body));
    });
});
app.listen(3003, function () {
    console.log('Example app listening on port 3003!');
    pool.query('set search_path to aa');
});
/**
 * Zadanie:
 * stworzyć tabelę messages, z polami:
 * id SERIAL PRIMARY KEY,
 * title TEXT
 * content TEXT
 *
 * Potem w aplikacji oprogramować ścieżkę '/messages' która wylistuje
 * wsystkie dane z tabeli messages
 */ 
