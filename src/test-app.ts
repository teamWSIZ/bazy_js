// lib/app.ts
import express = require('express');
import log4js = require('log4js');

const NodeRSA = require('node-rsa');
const fs = require('fs-extra');


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
    console.log(`endpoint /test, time: ${time}`);
    res.send({'secret':11, 'current_time': time});
});

app.get('/test_e_d', (req, res) => {
    const key = new NodeRSA({b: 512});

    const text = 'Hello RSA!';
    const encrypted = key.encrypt(text, 'base64');
    console.log('encrypted: ', encrypted);
    const decrypted = key.decrypt(encrypted, 'utf8');
    console.log('decrypted: ', decrypted);
    res.send({'plain': text, 'enc': encrypted, 'dec': decrypted});
});

//load text files
app.get('/dd', (req, res) => {
    //wczytywanie pliku tekstowego
    let public_key_text = fs.readFileSync('keys/alpha.pub');
    res.send({'public':public_key_text.toString()});
});

app.get('/type', (req, res) => {

    let public_key_text = fs.readFileSync('keys/alpha.pub');
    let public_key = new NodeRSA();
    public_key.importKey(public_key_text);  //tworzenie obiektu typu NodeRSA z tekstu klucza publicznego
    //-------
    let private_key = (new NodeRSA())
        .importKey(fs.readFileSync('keys/beta.key')); //... klucza prywatnego
    res.send({
        'is_public': public_key.isPublic(),
        'is_private': public_key.isPrivate(),
        'is_key_private': private_key.isPublic()
    });
});

app.get('/zeta', (req, res) => {
    let pub = (new NodeRSA()).importKey(fs.readFileSync('keys/beta.pub'));
    let prv = (new NodeRSA()).importKey(fs.readFileSync('keys/beta.key'));
    let txt = 'abra kadabra';
    let enc = pub.encrypt(txt, 'base64');
    let dec = prv.decrypt(enc, 'utf8');
    res.send({'plain': txt, 'enc': enc, 'dec': dec});
});

const port = 3004;
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});

