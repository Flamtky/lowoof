import express from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { User } from './interfaces'
dotenv.config({ path: './vars.env' });


const app: express.Application = express();
const port: number = 8080;

const mySqlHost: string = process.env.MYSQL_HOST ?? '';
const mySqlPort: string = process.env.MYSQL_PORT ?? '';
const mySqlUser: string = process.env.MYSQL_USER ?? '';
const mySqlPassword: string = process.env.MYSQL_PWD ?? '';
const mySqlDatabase: string = process.env.MYSQL_DB ?? '';

function getConnection(): mysql.Pool {
    return mysql.createPool({
        connectionLimit: 10,
        host: mySqlHost,
        port: mySqlPort as unknown as number,
        user: mySqlUser,
        password: mySqlPassword,
        database: mySqlDatabase
    });

}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to lowoof-API!' });
});

app.get('/auth', (req, res) => {
    //TODO Add Login page and change token creation accordingly
    //Create Auth Token
    if (req.query.username && req.query.password) {
        var hashedPassword: string;
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT HASHEDPW FROM API_USER WHERE USERNAME = '${req.query.username}'`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, contact the administrator" });
                } else {
                    if (rows.length > 0) {
                        hashedPassword = rows[0].HASHEDPW;
                        if (bcrypt.compareSync(req.query.password as string, hashedPassword)) {
                            const token: any = jwt.sign(
                                {
                                    username: req.query.username,
                                    password: hashedPassword
                                },
                                process.env.JWT_SECRET ?? '',
                                { expiresIn: '2h' });
                            res.status(201).json(token);
                        } else {
                            res.status(401).json({ message: "Wrong Password" });
                        }
                    } else {
                        res.status(403).json({ message: "User not found, contact Admin to create an API account" });
                    }
                }

            }
        );
    } else {
        res.status(401).json({ message: "Missing Username or Password" });
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
    }
})

app.get('/users', (req, res) => {

    const connection: mysql.Pool = getConnection();
    connection.query(`SELECT * FROM USER`,
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
            } else {
                res.status(200).json(rows);
            }
        }
    );

});

app.get('/getuser', (req, res) => {
    if (req.query.userid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM USER WHERE USERID = '${req.query.userid}'`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                } else {
                    if (rows.length == 0) {
                        res.status(500).json({ message: "Given userid doesnt exist" });
                    } else {
                        delete rows[0]["PASSWORD"];
                        res.status(200).json(rows as User);
                    }
                }
            }
        );

    }
});

app.post('/adduser', (req, res) => {
    console.log(req.body);
    const user: User = req.body;

    const connection: mysql.Pool = getConnection();
    connection.query(`INSERT INTO USER (USERNAME, HASHEDPASSWORD, EMAIL, VORNAME, NACHNAME, GEBURTSTAG, INSTITUTION, TELEFONNUMMER, PLZ, WOHNORT, GESCHLECHT, ONLINESTATUS, MITGLIEDSCHAFTPAUSIERT)
        VALUES ('${user["USERNAME"]}', '${user["PASSWORD"]}', '${user["EMAIL"]}', '${user["VORNAME"]}', '${user["NACHNAME"]}', '${user["GEBURTSTAG"]}', '${user["INSTITUTION"]}', '${user["TELEFONNUMMER"]}', '${user["PLZ"]}', '${user["WOHNORT"]}', '${user["GESCHLECHT"]}', 0, 0)`,
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
            } else {
                res.status(200).json({ message: 'User added' });
            }
        }
    );

});

app.post('/updateuser', (req, res) => {
    console.log(req.body);
    const user: User = req.body;
    if (user.PASSWORD === undefined) {
        return res.status(401).json({ message: "Missing Password" });
    }
    const connection: mysql.Pool = getConnection();
    connection.query(`SELECT PASSWORD FROM USER WHERE USERID = ${user.USERID}`,
        async (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
            }
            if (await bcrypt.compareSync(user.PASSWORD as string, rows[0].PASSWORD)) {
                connection.query(`UPDATE USER SET SPRACHID = '${user["SPRACHID"]}', USERNAME = '${user["USERNAME"]}', EMAIL = '${user["EMAIL"]}', VORNAME = '${user["VORNAME"]}', NACHNAME = '${user["NACHNAME"]}', GEBURTSTAG = '${user["GEBURTSTAG"]}', INSTITUTION = '${user["INSTITUTION"]}',
                                    TELEFONNUMMER = '${user["TELEFONNUMMER"]}', PLZ = '${user["PLZ"]}', WOHNORT = '${user["WOHNORT"]}', GESCHLECHT = '${user["GESCHLECHT"]}', ONLINESTATUS = '${user["ONLINESTATUS"]}', MITGLIEDSCHAFTPAUSIERT = '${user["MITGLIEDSCHAFTPAUSIERT"]}' WHERE USERID = '${user["USERID"]}';`,
                    (err, rows, fields) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                        } else {
                            res.status(200).json({ message: 'User edited' });
                        }
                    }
                );
            } else {
                return res.status(401).json({ message: "Wrong Password" });
            }



        });
});


app.get('/getpetrelationships', (req, res) => {
    if (req.query.petid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = '${req.query.petid}' OR TIER_B_ID = '${req.query.petid}';`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                } else {
                    if (rows.length == 0) {
                        res.status(500).json({ message: "Given userid doesnt exist" });
                    } else {
                        res.status(200).json(rows);
                    }
                }
            }
        );

    }
});

app.get('/getuserpets', (req, res) => {
    if (req.query.userid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM TIER WHERE USERID = '${req.query.userid}';`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                } else {
                    if (rows.length == 0) {
                        res.status(500).json({ message: "Given userid doesnt exist or user does not have any Pets" });
                    } else {
                        res.status(200).json(rows);
                    }
                }
            }
        );

    }
});

app.get('/getpet', (req, res) => {
    if (req.query.petid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM TIER WHERE TIERID = '${req.query.petid}';`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                } else {
                    if (rows.length == 0) {
                        res.status(500).json({ message: "Given petid doesnt exist" });
                    } else {
                        res.status(200).json(rows);
                    }
                }
            }
        );

    }
});

app.post('/deleteuser', (req, res) => {
    if (req.body.userid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT PASSWORD FROM USER WHERE USERID = ${req.body.userId}`,
            async (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                }
                if (await bcrypt.compareSync(req.body.password, rows[0].PASSWORD)) {

                    connection.query(`DELETE FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = '${req.body.petid}' OR TIER_B_ID = '${req.body.petid}'`,
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                            }else{
                                connection.query(`DELETE FROM TIER WHERE USERID = '${req.body.userid}'`,
                                    (err, rows, fields) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                                        }else{
                                            connection.query(`DELETE FROM USER WHERE USERID = '${req.body.userid}'`,
                                                (err, rows, fields) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                                                    } else {
                                                        res.status(200).json({ message: 'User deleted' });
                                                    }
                                                }
                                            );
                                        }
    
                                    }
                                );
                            }
                        }
                    );
                } else {
                    return res.status(401).json({ message: "Wrong Password" });
                }
            }
        );
    }
});

app.post('/deletepet', (req, res) => {
    if (req.body.petid) {
        const connection: mysql.Pool = getConnection();
        var userId: number = 0;
        connection.query(`SELECT USERID FROM TIER WHERE TIERID = '${req.body.petid}'`, (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
            } else {
                console.log(rows);
                userId = rows[0].USERID;
                connection.query(`SELECT PASSWORD FROM USER WHERE USERID = ${userId}`,
                    async (err, rows, fields) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                        }
                        console.log(rows);
                        console.log(req.body.password);
                        if (await bcrypt.compareSync(req.body.password, rows[0].PASSWORD)) {
                            console.log("Password was correct");
                            connection.query(`DELETE FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = '${req.body.petid}' OR TIER_B_ID = '${req.body.petid}'`,
                                (err, rows, fields) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                                    }
                                }
                            );
                            connection.query(`DELETE FROM TIER WHERE TIERID = '${req.body.petid}'`,
                                (err, rows, fields) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json({ message: "Something went wrong, Try again or contact the administrator" });
                                    } else {
                                        console.log("Pet deleted ID:" + req.body.petid);
                                        res.status(200).json({ message: 'Pet deleted' });
                                    }
                                }
                            );
                        } else {
                            return res.status(401).json({ message: "Wrong Password" });
                        }


                    });
            }
        });


    }
});

app.listen(port, () => console.log(`Lowoof API running on port ${port}!`));