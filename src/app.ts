// lib/app.ts
import express = require('express');
import {User} from "./user";
import {Result} from "./result";

import log4js = require('log4js');
const log = log4js.getLogger('Controller');
log.level = 'debug';

//rest calls
import request = require('request');

// Create a new express application instance
const app: express.Application = express();

//pg; https://node-postgres.com
const Pool = require('pg').Pool;
const pool = new Pool({
  host: '10.10.0.33',
  port: 5432,
  database: 'student',
  user: 'student',
  password: 'wsiz#1234'
});

app.get('/users', (req, res) => {
  pool.query('select * from aa.x order by name', (er:any, re:any) => {
    if (er) throw er;
    res.send(re.rows);
  });
});

app.get('/users/:userid', (req, res) => {
  pool.query('select * from aa.x where id=$1 order by name', [req.params.userid],
      (er:any, re:any) => {
        if (er) throw er;
        res.send(re.rows);
      });
});

app.get('/users/create/:name', (req, res) => {
  console.log('creating');
  pool.query('INSERT INTO aa.x (name) VALUES ($1) returning id', [req.params.name],
      (er:any, re:any) => {
        if (er) throw er;
        console.log('done');
        res.send(re.rows);
      });
});

app.get('/now', (q, s) => {
  pool.query('select now()', (e:any, r:any) => {
    if (e) s.send(e);
    s.send(r.rows);
  });
});



app.get('/', function (req, res) {
  let u = new User('Abra', 'Kadabras');
  res.send('Hello World!' + JSON.stringify(u));
});

app.get('/add', function (req, res) {
  log.info('/add path invoked');
  let a = parseInt(req.query.a);
  let b = parseInt(req.query.b);
  let result = new Result(a + b, 'OK');
  // throw new Error("killed"); //callback just exits
  res.send(result);
  log.info('response sent')
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
