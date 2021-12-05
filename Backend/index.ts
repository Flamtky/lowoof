import express from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
dotenv.config({ path: './vars.env' });

 
const app: express.Application = express();
const port: number = 3000;

const mySqlHost: string = process.env.MYSQL_HOST ?? '';
const mySqlPort: string = process.env.MYSQL_PORT ?? '';
const mySqlUser: string = process.env.MYSQL_USER ?? '';
const mySqlPassword: string = process.env.MYSQL_PWD ?? '';
const mySqlDatabase: string = process.env.MYSQL_DB ?? '';

function getConnection(): mysql.Connection {
    return mysql.createConnection({
        host: mySqlHost,
        port: mySqlPort as unknown as number,
        user: mySqlUser,
        password: mySqlPassword,
        database: mySqlDatabase
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({message: 'Welcome to lowoof-API!'});
});

app.get('/auth',(req, res) => {
    //TODO Add Login page and change token creation accordingly
    //Create Auth Token
    if(req.query.username && req.query.password) {
        var hashedPassword:string;
        const connection: mysql.Connection = getConnection();
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
        connection.query(`SELECT HASHEDPW FROM API_USER WHERE USERNAME = '${req.query.username}'`,
            (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({message:"Something went wrong, contact the administrator"});
            } else {
                if(rows.length > 0) {
                hashedPassword = rows[0].HASHEDPW;
                if(bcrypt.compareSync(req.query.password as string, hashedPassword)){
                    const token:any = jwt.sign(
                        {username: req.query.username,
                        password: hashedPassword},
                        process.env.JWT_SECRET ?? '',
                        {expiresIn: '2h'});
                    res.status(201).json(token);
                }else{
                    res.status(401).json({message:"Wrong Password"});
                }
            } else {
                res.status(500).json({message:"User not found, contact Admin to create an API account"});
                }
            }
                connection.end();
            }
        );
}
});

app.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET ?? '', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }})

app.get('/users', (req, res) => {
    
    const connection: mysql.Connection = getConnection();
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
    connection.query(`SELECT * FROM USER`,
        (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({message:"Something went wrong, Try again or contact the administrator"});
        } else {
            res.status(200).json(rows);
        }
    }
    );
    connection.end();
});

app.get('/getuser', (req, res) => {
    if(req.query.userid){
        const connection: mysql.Connection = getConnection();
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
        connection.query(`SELECT * FROM USER WHERE USERID = '${req.query.userid}'`,
            (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({message:"Something went wrong, Try again or contact the administrator"});
            } else {
                if(rows.length == 0) {
                    res.status(500).json({message:"Given userid doesnt exist"});
                } else {
                    res.status(200).json(rows);
                }
            }
        }
        );
        connection.end();
}});

app.post('/adduser', (req, res) => {
    console.log(req.body);
    const username:string = req.body.username;
    const password:string = req.body.password;
    const email:string = req.body.email;
    const vorname:string = req.body.vorname;
    const nachname:string = req.body.nachname;
    const geburtsdatum:string = req.body.geburtsdatum;
    const institution:string = req.body.institution;
    const telefonnummer:string = req.body.telefonnummer;
    const plz:string = req.body.plz;
    const adresse:string = req.body.adresse;
    const geschlecht:string = req.body.geschlecht;


    const connection: mysql.Connection = getConnection();
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
    connection.query(`INSERT INTO USER (USERNAME, HASHEDPASSWORD, EMAIL, VORNAME, NACHNAME, GEBURTSTAG, INSTITUTION, TELEFONNUMMER, PLZ, WOHNORT, GESCHLECHT, ONLINESTATUS, MITGLIEDSCHAFTPAUSIERT)
        VALUES ('${username}', '${password}', '${email}', '${vorname}', '${nachname}', '${geburtsdatum}', '${institution}', '${telefonnummer}', '${plz}', '${adresse}', '${geschlecht}', 0, 0)`,
        (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({message:"Something went wrong, Try again or contact the administrator"});
        } else {
            res.status(200).json({message: 'User added'});
        }
    }
    );
    connection.end();
});

app.post('/updateuser', (req, res) => {
    console.log(req.body);
    const userid:string = req.body.id;
    const sprachId:string = req.body.sprachId;
    const username:string = req.body.username;
    const email:string = req.body.email;
    const vorname:string = req.body.vorname;
    const nachname:string = req.body.nachname;
    const geburtsdatum:string = req.body.geburtsdatum;
    const institution:string = req.body.institution;
    const telefonnummer:string = req.body.telefonnummer;
    const plz:string = req.body.plz;
    const adresse:string = req.body.adresse;
    const geschlecht:string = req.body.geschlecht;
    const onlinestatus:string = req.body.onlinestatus;
    const mitgliedschaftPausiert:string = req.body.mitgliedschaftPausiert;


    const connection: mysql.Connection = getConnection();
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
    connection.query(`UPDATE USER SET SPRACHID = '${sprachId}', USERNAME = '${username}', EMAIL = '${email}', VORNAME = '${vorname}', NACHNAME = '${nachname}', GEBURTSTAG = '${geburtsdatum}', INSTITUTION = '${institution}',
    TELEFONNUMMER = '${telefonnummer}', PLZ = '${plz}', WOHNORT = '${adresse}', GESCHLECHT = '${geschlecht}', ONLINESTATUS = '${onlinestatus}', MITGLIEDSCHAFTPAUSIERT = '${mitgliedschaftPausiert}' WHERE USERID = '${userid}';`,
    (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({message:"Something went wrong, Try again or contact the administrator"});
        } else {
            res.status(200).json({message: 'User edited'});
        }
    }
    );
    connection.end();
});


app.listen(port, () => console.log(`Lowoof API running on port ${port}!`))