// lib/app.ts
import express = require('express');
import log4js = require('log4js');

const log = log4js.getLogger('Controller');
log.level = 'debug';

// Create a new express application instance
const app: express.Application = express();

app.use(express.json());        //pozwala na czytanie req.body

app.use((req,res,next)=>{
    //konfiguracja CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/test', (req, res) => {
    let time = new Date();
    console.log(`endpoint /test, time: ${time}`)
    res.send({'secret':11, 'current_time': time});
});

app.listen(3003, function () {
    console.log('Example app listening on port 3003!');
});

