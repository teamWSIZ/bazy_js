"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Promise = require('bluebird');
const initOptions = {
    promiseLib: Promise
};
const pgp = require('pg-promise')(initOptions);
const app = express();
let faker = require('faker');
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
    host: 'localhost',
    port: 5432,
    database: 'fake_user',
    user: 'postgres',
    password: ''
});
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'fake_user',
    user: 'postgres',
    password: ''
};
app.get('/status', (req, res) => {
    res.send('Highscore app works OK');
});
app.get('/fake', (req, res) => {
    pool.query('select * from fake_user.fake_user.fake_user order by uid', (error, response) => {
        if (error)
            throw error;
        res.send(response.rows);
    });
});
app.get('/users/generate', (req, res) => {
    faker.locale = "pl";
    let fakeUsers = [];
    let count = req.query.count;
    for (let i = 0; i < count; i++) {
        let fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            address: faker.address.streetAddress(),
            image: faker.image.avatar()
        };
        fakeUsers.push(fakeUser);
    }
    console.log(fakeUsers);
    const db = pgp(cn);
    const cs = new pgp.helpers.ColumnSet([
        { name: 'firstname', prop: 'firstName' },
        { name: 'lastname', prop: 'lastName' },
        'city',
        'address',
        'image'
    ], { table: { table: 'fake_user', schema: 'fake_user' } });
    const query = pgp.helpers.insert(fakeUsers, cs);
    db.none(query)
        .then((response) => {
        console.log("Success");
    })
        .catch((error) => {
        console.log(`error: ${error}`);
    });
    res.send(fakeUsers);
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    pool.query('set search_path to aa');
});
