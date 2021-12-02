import express from 'express';
import mysql from 'mysql';
 
const app: express.Application = express();
const port: number = 3000;

const mySqlHost: string = 'db5005941567.hosting-data.io';
const mySqlUser: string = 'dbu1141556';
const mySqlPassword: string = 'C8Gh-aVYx=Bcq6pc7-WZ';
const mySqlDatabase: string = 'dbs4979312';

function getConnection() {
    return mysql.createConnection({
        host: mySqlHost,
        user: mySqlUser,
        password: mySqlPassword,
        database: mySqlDatabase
    });
}

app.get('/', (req, res) => {
    res.json({message: 'Welcome to lowoof-API!'});
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))