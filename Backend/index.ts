import express from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { User, Response, Pet } from './interfaces'
dotenv.config({ path: './vars.env' });


const app: express.Application = express();
const port: number = 8080;

const mySqlHost: string = process.env.MYSQL_HOST ?? '';
const mySqlPort: string = process.env.MYSQL_PORT ?? '';
const mySqlUser: string = process.env.MYSQL_USER ?? '';
const mySqlPassword: string = process.env.MYSQL_PWD ?? '';
const mySqlDatabase: string = process.env.MYSQL_DB ?? '';

var sqlcon: mysql.Pool = mysql.createPool({
    connectionLimit: 10,
    host: mySqlHost,
    port: mySqlPort as unknown as number,
    user: mySqlUser,
    password: mySqlPassword,
    database: mySqlDatabase
});

function getConnection(): mysql.Pool {
    return sqlcon

}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to lowoof-API!' });
});

app.post('/auth', (req, res) => {
    //TODO Add Login page and change token creation accordingly
    //Create Auth Token
    if (req.body.username && req.body.password) {
        var hashedPassword: string;
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT HASHEDPW FROM API_USER WHERE USERNAME = '${req.body.username}'`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, contact the administrator" });
                } else {
                    if (rows.length > 0) {
                        hashedPassword = rows[0].HASHEDPW;
                        if (bcrypt.compareSync(req.body.password as string, hashedPassword)) {
                            const token: any = jwt.sign(
                                {
                                    username: req.body.username,
                                    password: hashedPassword
                                },
                                process.env.JWT_SECRET ?? '',
                                { expiresIn: '2h' });
                            res.status(201).json(token);
                        } else {
                            res.status(401).json({ status: res.statusCode, message: "Wrong Password" } as Response);
                        }
                    } else {
                        res.status(403).json({ status: res.statusCode, message: "User not found, contact Admin to create an API account" } as Response);
                    }
                }

            }
        );
    } else {
        res.status(401).json({ status: res.statusCode, message: "Missing Username or Password" } as Response);
    }
});
/**
 * This is the Middleware to Authenticate the User via JWT Token
 */
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET ?? '', (err, user) => {
            if (err) {
                return res.status(403).json({ status: res.statusCode, message: 'Invalid Authorization Token' } as Response);
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ status: res.statusCode, message: "Missing Authorization Header" } as Response);
    }
})
//Allowed Users: All Users
app.get('/users', (req, res) => {

    const connection: mysql.Pool = getConnection();
    connection.query(`SELECT * FROM USER`,
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" });
            } else {
                res.status(200).json(rows as User[]);
            }
        }
    );

});
//Allowed Users: All Users
app.get('/getuser', (req, res) => {
    if (req.query.userid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM USER WHERE USERID = '${req.query.userid}'`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                } else {
                    if (rows.length == 0) {
                        res.status(404).json({ status: res.statusCode, message: "User not Found" } as Response);
                    } else {
                        delete rows[0]["PASSWORD"];
                        res.status(200).json(rows as User);
                    }
                }
            }
        );

    }
});
//Allowed Users: Everyone
app.post('/adduser', (req, res) => {
    console.log(req.body);
    const user: User = req.body;

    const connection: mysql.Pool = getConnection();
    connection.query(`INSERT INTO USER (USERNAME, PASSWORD, EMAIL, VORNAME, NACHNAME, GEBURTSTAG, INSTITUTION, TELEFONNUMMER, PLZ, WOHNORT, GESCHLECHT, ONLINESTATUS, MITGLIEDSCHAFTPAUSIERT)
        VALUES ('${user["USERNAME"]}', '${user["PASSWORD"]}', '${user["EMAIL"]}', '${user["VORNAME"]}', '${user["NACHNAME"]}', '${user["GEBURTSTAG"]}', '${user["INSTITUTION"]}', '${user["TELEFONNUMMER"]}', '${user["PLZ"]}', '${user["WOHNORT"]}', '${user["GESCHLECHT"]}', 0, 0)`,
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
            } else {
                res.status(200).json({ status: res.statusCode, message: 'User added' } as Response);
            }
        }
    );

});
//Allowed Users: User
app.post('/updateuser', (req, res) => {
    console.log(req.body);
    const user: User = req.body;
    if (user.PASSWORD === undefined) {
        return res.status(401).json({ status: res.statusCode, message: "Missing Password" } as Response);
    }
    const connection: mysql.Pool = getConnection();
    connection.query(`SELECT PASSWORD FROM USER WHERE USERID = ${user.USERID}`,
        async (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
            }
            if (await bcrypt.compareSync(user.PASSWORD as string, rows[0].PASSWORD)) {
                connection.query(`UPDATE USER SET SPRACHID = '${user["SPRACHID"]}', USERNAME = '${user["USERNAME"]}', EMAIL = '${user["EMAIL"]}', VORNAME = '${user["VORNAME"]}', NACHNAME = '${user["NACHNAME"]}', GEBURTSTAG = '${user["GEBURTSTAG"]}', INSTITUTION = '${user["INSTITUTION"]}',
                                    TELEFONNUMMER = '${user["TELEFONNUMMER"]}', PLZ = '${user["PLZ"]}', WOHNORT = '${user["WOHNORT"]}', GESCHLECHT = '${user["GESCHLECHT"]}', ONLINESTATUS = '${user["ONLINESTATUS"]}', MITGLIEDSCHAFTPAUSIERT = '${user["MITGLIEDSCHAFTPAUSIERT"]}' WHERE USERID = '${user["USERID"]}';`,
                    (err, rows, fields) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                        } else {
                            res.status(200).json({ status: res.statusCode, message: 'User edited' } as Response);
                        }
                    }
                );
            } else {
                return res.status(403).json({ status: res.statusCode, message: "Wrong Password" } as Response);
            }



        });
});

//Allowed Users: User
app.get('/getpetrelationships', (req, res) => {
    if (req.query.petid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = '${req.query.petid}' OR TIER_B_ID = '${req.query.petid}';`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                } else {
                    res.status(200).json(rows);//TODO: Add Pet Relationships as Interface
                }
            }
        );

    }
});

//Allowed Users: User
app.get('/getuserpets', (req, res) => {
    if (req.query.userid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM TIER WHERE USERID = '${req.query.userid}';`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                } else {
                    res.status(200).json(rows as Pet[]);
                }
            }
        );

    }
});
//Allowed Users: All Users
app.get('/getpet', (req, res) => {
    if (req.query.petid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM TIER WHERE TIERID = '${req.query.petid}';`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                } else {
                    if (rows.length == 0) {
                        res.status(404).json({ status: res.statusCode, message: "Pet not Found" });
                    } else {
                        res.status(200).json(rows as Pet);
                    }
                }
            }
        );

    }
});
//Allowed Users: User
app.post('/deleteuser', (req, res) => {
    if (req.body.userid) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT PASSWORD FROM USER WHERE USERID = ${req.body.userId}`,
            async (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                }
                if (await bcrypt.compareSync(req.body.password, rows[0].PASSWORD)) {

                    connection.query(`DELETE FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = '${req.body.petid}' OR TIER_B_ID = '${req.body.petid}'`,
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                            } else {
                                connection.query(`DELETE FROM TIER WHERE USERID = '${req.body.userid}'`,
                                    (err, rows, fields) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                                        } else {
                                            connection.query(`DELETE FROM USER WHERE USERID = '${req.body.userid}'`,
                                                (err, rows, fields) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                                                    } else {
                                                        res.status(200).json({ status: res.statusCode, message: 'User deleted' } as Response);
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
                    return res.status(401).json({ status: res.statusCode, message: "Wrong Password" } as Response);
                }
            }
        );
    }
});
//Allowed Users: User
app.post('/deletepet', (req, res) => {
    if (req.body.petid) {
        const connection: mysql.Pool = getConnection();
        var userId: number = 0;
        connection.query(`SELECT USERID FROM TIER WHERE TIERID = '${req.body.petid}'`, (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
            } else {
                console.log(rows);
                userId = rows[0].USERID;
                connection.query(`SELECT PASSWORD FROM USER WHERE USERID = ${userId}`,
                    async (err, rows, fields) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                        }
                        console.log(rows);
                        console.log(req.body.password);
                        if (await bcrypt.compareSync(req.body.password, rows[0].PASSWORD)) {
                            console.log("Password was correct");
                            connection.query(`DELETE FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = '${req.body.petid}' OR TIER_B_ID = '${req.body.petid}'`,
                                (err, rows, fields) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                                    }
                                }
                            );
                            connection.query(`DELETE FROM TIER WHERE TIERID = '${req.body.petid}'`,
                                (err, rows, fields) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                                    } else {
                                        console.log("Pet deleted ID:" + req.body.petid);
                                        res.status(200).json({ status: res.statusCode, message: 'Pet deleted' } as Response);
                                    }
                                }
                            );
                        } else {
                            return res.status(401).json({ status: res.statusCode, message: "Wrong Password" } as Response);
                        }


                    });
            }
        });


    }
});
//Allowed Users: User
app.post('/sendfriendrequest', (req, res) => {
    const user: User = req.body.user;
    if (req.body.petid && req.body.friendid && user) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT USERID FROM TIER WHERE TIERID = '${req.body.petid}';`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                } else if (rows[0].USERID === user.USERID) {
                    var TIER_A_ID: number;
                    var TIER_B_ID: number;
                    var RELATIONSHIP: string;
                    var RELATIONID: number;
                    if (req.body.petid < req.body.friendid) {
                        TIER_A_ID = req.body.petid;
                        TIER_B_ID = req.body.friendid;
                        RELATIONSHIP = "A requested B";
                    } else {
                        TIER_A_ID = req.body.friendid;
                        TIER_B_ID = req.body.petid;
                        RELATIONSHIP = "B requested A";
                    }
                    RELATIONID = (`${TIER_A_ID}${TIER_B_ID}`) as unknown as number;
                    connection.query(`INSERT INTO TIER_RELATIONSHIPS (RELATIONID, TIER_A_ID, TIER_B_ID, RELATIONSHIP) VALUES ('${RELATIONID}','${TIER_A_ID}', '${TIER_B_ID}', '${RELATIONSHIP}');`,
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                            } else {
                                res.status(200).json({ status: res.statusCode, message: 'Friend request sent' } as Response);
                            }
                        }
                    );
                } else {
                    res.status(401).json({ status: res.statusCode, message: "You are not the owner of this pet" } as Response);
                }

            }
        );

    } else {
        res.status(401).json({ status: res.statusCode, message: "You are not the owner of this pet" } as Response);
    }
});
//Allowed Users: User
app.post('/acceptfriendrequest', (req, res) => {
    const user: User = req.body.user;
    if (req.body.petid && req.body.friendid && user) {
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT USERID FROM TIER WHERE TIERID = '${req.body.petid}';`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                } else if (rows[0].USERID === user.USERID) {
                    var TIER_A_ID: number;
                    var TIER_B_ID: number;
                    var RELATIONSHIP: string;
                    var RELATIONID: number;
                    if (req.body.petid < req.body.friendid) {
                        TIER_A_ID = req.body.petid;
                        TIER_B_ID = req.body.friendid;
                        RELATIONSHIP = "A requested B";
                    } else {
                        TIER_A_ID = req.body.friendid;
                        TIER_B_ID = req.body.petid;
                        RELATIONSHIP = "B requested A";
                    }
                    RELATIONID = (`${TIER_A_ID}${TIER_B_ID}`) as unknown as number;

                    connection.query(`SELECT RELATIONSHIP FROM TIER_RELATIONSHIPS WHERE RELATIONID = '${RELATIONID}';`,
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                            } else if (((rows[0].RELATIONSHIP as string).startsWith("A") && TIER_B_ID == req.body.petid) || ((rows[0].RELATIONSHIP as string).startsWith("B") && TIER_A_ID == req.body.petid)) {
                                RELATIONSHIP = "Friends";
                                connection.query(`UPDATE TIER_RELATIONSHIPS SET RELATIONSHIP = '${RELATIONSHIP}' WHERE TIER_RELATIONSHIPS.RELATIONID = ${RELATIONID};`,
                                    (err, rows, fields) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).json({ status: res.statusCode, message: "Something went wrong, Try again or contact the administrator" } as Response);
                                        } else {
                                            res.status(200).json({ status: res.statusCode, message: 'Friend request accepted' } as Response);
                                        }
                                    }
                                );
                            } else {
                                res.status(404).json({ status: res.statusCode, message: "There is no pendig Friend request between these Pets or you cant accept your own request" } as Response);
                            }
                        });


                } else {
                    res.status(401).json({ status: res.statusCode, message: "You are not the owner of this pet" } as Response);
                }

            }
        );

    } else {
        res.status(400).json({ status: res.statusCode, message: "You didnt provide the required informations" } as Response);
    }
});

app.listen(port, () => console.log(`Lowoof API running on port ${port}!`));