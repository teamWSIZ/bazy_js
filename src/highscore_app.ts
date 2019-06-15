import express = require('express');
const app: express.Application = express();

app.use(express.json());        //pozwala na czytanie req.body

app.use((req,res,next)=>{
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

app.get('/status', (req,res)=>{
    res.send('Highscore app works OK');
});



app.listen(3003, function () {
    console.log('Example app listening on port 3003!');
    pool.query('set search_path to aa');
});

