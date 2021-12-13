import express, { response } from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { User, Response, Pet, Relationship, Message, Preference, Report } from './interfaces'
import Queries from "./sqlqueries"
dotenv.config({ path: './vars.env' });

const queries = new Queries();
const app: express.Application = express();
const port: number = 8080;
let tokenBlacklist: string[] = [];
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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to lowoof-API!' });
});

app.post('/auth', (req, res) => {
    //Create Auth Token
    if (req.body.username && req.body.password) {
        var hashedPassword: string;
        const connection: mysql.Pool = getConnection();
        connection.query(`SELECT * FROM USER WHERE USERNAME = ?`, [req.body.username],
            async (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, contact the administrator" });
                } else {
                    if (rows.length > 0) {
                        if (rows[0].MITGLIEDSCHAFTPAUSIERT == 1) {
                            if (rows[0].BANNEDUNTIL == null) {
                                return res.status(401).json({ message: "User is banned" });
                            } else {
                                if (new Date(rows[0].BANNEDUNTIL) > new Date()) {
                                    return res.status(401).json({ message: "User is banned" });
                                } else {
                                    await queries.unbanUser(rows[0].USERID);
                                }
                            }

                        }
                        hashedPassword = rows[0].PASSWORD;
                        delete rows[0].PASSWORD;
                        if (bcrypt.compareSync(req.body.password as string, hashedPassword)) {
                            const token: any = jwt.sign(
                                {
                                    username: req.body.username,
                                    password: hashedPassword
                                },
                                process.env.JWT_SECRET ?? '',
                                { expiresIn: '2h' });

                            res.status(201).json({ token: token, user: rows[0] as User });
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




//Allowed Users: All Users
app.get('/getpet', async (req, res) => {
    if (req.query.petid) {
        var response: Response | Pet = await queries.getPetByID(req.query.petid as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Pet);
        }

    } else {
        res.status(400).json({ status: res.statusCode, message: "Missing PetID" } as Response);
    }
});


//Allowed Users: All Users
app.get('/users', async (req, res) => {
    var response: Response | User[] = await queries.getAllUsers();

    if ("status" in response) {
        res.status(response.status).json(response);
    } else {
        res.status(200).json(response);
    }


});

//Allowed Users: All Users
app.get('/getuser', async (req, res) => {
    if (req.query.userid) {
        var response: Response | User = await queries.getUserByID(req.query.userid as unknown as number)
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response);
        }
    } else {
        return res.status(400).json({ status: res.statusCode, message: "Missing UserID" } as Response);
    }
});
app.get('/getuserlanguage', async (req, res) => {
    if (req.query.userid) {
        var response: string | Response = await queries.getUserLanguage(req.query.userid as unknown as number)
        if (response.hasOwnProperty("status")) {
            res.status((response as Response).status).json(response);
        } else {
            res.status(200).json(response);
        }
    } else {
        return res.status(400).json({ status: res.statusCode, message: "Missing UserID" } as Response);
    }
});


//Allowed Users: Everyone
app.post('/adduser', async (req, res) => {
    console.log(req.body);
    const user: User = req.body;
    var response: Response = await queries.addUser(user);
    console.log(response);
    return res.status(response.status).json(response);
});


/**
 * This is the Middleware to Authenticate the User via JWT Token
 */
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (tokenBlacklist.includes(token)) {
            return res.status(401).json({ status: res.statusCode, message: "Token is blacklisted" } as Response);
        }
        jwt.verify(token, process.env.JWT_SECRET ?? '', (err, user) => {
            if (err) {
                return res.status(401).json({ status: res.statusCode, message: 'Invalid Authorization Token' } as Response);
            }
            req.user = user;
            next();
        });
    } else {
        res.status(403).json({ status: res.statusCode, message: "Missing Authorization Header" } as Response);
    }
})

//Allowed Users: All Users
app.get('/getuserpets', async (req, res) => {
    if (req.query.userid) {
        var response: Response | Pet[] = await queries.getUserPets(req.query.userid as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Pet[]);
        }

    } else {
        res.status(400).json({ status: res.statusCode, message: "Missing UserID" } as Response);
    }

});

app.post('/addpet', async (req, res) => {
    console.log(req.body);
    const pet: Pet = req.body;
    if ("USERID" in req.body) {
        var isLoggedIn: boolean = await queries.authenticateByUserId(req.user, pet.USERID as unknown as number);
        if (!isLoggedIn) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to add a Pet to this user" } as Response);
        } else {
            var response: Response = await queries.addPet(pet);
            console.log(response);
            return res.status(response.status).json(response);
        }
    } else {
        return res.status(400).json({ status: res.statusCode, message: "Invalid Pet object" } as Response);
    }

});



//Allowed Users: User
app.post('/updateuser', async (req, res) => {
    console.log(req.body);
    if ("USERNAME" in req.body) {
        const user: User = req.body;
        var isCorrectUser: boolean = await queries.authenticateByUserObject(req.user, user);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.updateUser(user);
        return res.status(response.status).json(response);
    } else {
        return res.status(400).json({ status: res.statusCode, message: "We didnt get a valid user object" } as Response);
    }

});

app.post('/updatepet', async (req, res) => {
    console.log(req.body);
    if ("TIERID" in req.body) {
        const pet: Pet = req.body;
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.TIERID as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.updatePet(pet);
        return res.status(response.status).json(response);
    } else {
        return res.status(400).json({ status: res.statusCode, message: "We didnt get a valid pet object" } as Response);
    }

});

app.post('/setonlinestatus', async (req, res) => {
    if (req.body.userid && req.body.status != undefined) {
        var isCorrectUser: boolean = await queries.authenticateByUserId(req.user, req.body.userid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.setOnlineStatus(req.body.userid as unknown as number, req.body.status as unknown as boolean);
        return res.status(response.status).json(response);
    }
});

//Allowed Users: User
app.get('/getpetrelationships', async (req, res) => {

    if (req.query.petid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.query.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response | Relationship[] = await queries.getPetRelationships(req.query.petid as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Relationship[]);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "Missing PetID" } as Response);
    }
});



//Allowed Users: User
app.post('/deleteuser', async (req, res) => {

    console.log("Delete User " + req.body.userid + "...");
    if (req.body.userid && req.body.reason) {
        var isCorrectUser: boolean = await queries.authenticateByUserId(req.user, req.body.userid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        const connection: mysql.Pool = getConnection();
        var pets: Response | Pet[] = await queries.getUserPets(req.body.userid as unknown as number);
        if ("status" in pets) {
            return res.status(pets.status).json(pets);
        }
        console.log("Deleting Users Pets Chats...");
        pets.forEach(async (pet: Pet) => {
            var chats : Response|Pet[] = await queries.getChats(pet.TIERID as unknown as number);
            if ("status" in chats) {
                return res.status(chats.status).json(chats);
            }else{
                chats.forEach(async (chat: Pet) => {
                    await queries.deleteChat(pet.TIERID,chat.TIERID);
                });
            }
        });
        console.log("Deleting Users Pets Matches...");
        pets.forEach(async (pet: Pet) => {
            var response = await queries.deletePetMatches(pet.TIERID);
        });
        
        console.log("Deleting Users Pets Relationships...");
        pets.forEach(async element => {
            await queries.deletePetRelationships(element.TIERID);
        });
        console.log("Deleting Users Pets...");
        await queries.deleteUserPets(req.body.userid as unknown as number);
        console.log("Deleting User...");
        var response: Response = await queries.deleteUser(req.body.userid as unknown as number,req.body.reason);
        console.log("Finished Deleting User");
        return res.status(response.status).json(response);

    } else {
        res.status(400).json({ status: res.statusCode, message: "Missing UserID" } as Response);
    }
});

app.get('/areuserfriends', async (req, res) => {
    if(req.query.userid && req.query.friendid){
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.query.userid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response | boolean = await queries.areUserFriends(req.query.userid as unknown as number, req.query.friendid as unknown as number);
        if(typeof response != "boolean"){
            return res.status(response.status).json(response);
        }else{
            return res.status(200).json(response);
        }
    }else{
        res.status(400).json({ status: res.statusCode, message: "Missing PetID or FriendID" } as Response);
    }
    });

//Allowed Users: User
app.post('/deletepet', async (req, res) => {
    if (req.body.petid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        var isAdmin: boolean = await queries.isUserAdmin(req.user);
        console.log(0);
        if (!isCorrectUser && !isAdmin) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        console.log(1);
        await queries.deletePetRelationships(req.body.petid as unknown as number);
        console.log(2);
        await queries.removePetReports(req.body.petid as unknown as number);
        console.log(3);
        var response: Response = await queries.deletePet(req.body.petid as unknown as number);
        console.log(4);
        return res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "Missing PetID" } as Response);
    }
});
//Allowed Users: User
app.post('/sendfriendrequest', async (req, res) => {

    if (req.body.petid && req.body.friendid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = { status: 500, message: "Internal Server Error" };
        var relation = await queries.getRelationshipBetweenPets(req.body.petid as unknown as number, req.body.friendid as unknown as number);
        if ("status" in relation) {
            response = await queries.sendFriendRequest(req.body.petid as unknown as number, req.body.friendid as unknown as number);
        } else if (relation.RELATIONSHIP == "Friends") {
            return res.status(400).json({ status: res.statusCode, message: "You are already friends" } as Response);
        } else if (relation.RELATIONSHIP.includes("requested")) {
            return res.status(409).json({ status: res.statusCode, message: "There is already a Friendrequest" } as Response);
        }
        res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});
//Allowed Users: User
app.post('/acceptfriendrequest', async (req, res) => {

    if (req.body.petid && req.body.friendid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }

        var relation: Relationship | Response = await queries.getRelationshipBetweenPets(req.body.petid as unknown as number, req.body.friendid as unknown as number);
        if ("status" in relation) {
            return res.status(relation.status).json(relation);
        } else if (relation.RELATIONSHIP == "Friends") {
            return res.status(400).json({ status: res.statusCode, message: "You are already friends" } as Response);
        } else {
            if (relation.RELATIONSHIP.startsWith("A") && req.body.petid == relation.TIER_B_ID || relation.RELATIONSHIP.startsWith("B") && req.body.petid == relation.TIER_A_ID) {
                var response: Response = await queries.acceptFriendRequest(relation.RELATIONID);
                res.status(response.status).json(response);
            } else {
                return res.status(400).json({ status: res.statusCode, message: "You are not the requested" } as Response);
            }
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "You didnt provide the required informations" } as Response);
    }
});

app.post('/removefriend', async (req, res) => {

    if (req.body.petid && req.body.friendid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }

        var response: Response = { status: 500, message: "Internal Server Error" };
        var relation = await queries.getRelationshipBetweenPets(req.body.petid as unknown as number, req.body.friendid as unknown as number);
        if ("status" in relation) {
            return res.status(400).json({ status: res.statusCode, message: "There is no relationship" } as Response);
        } else {
            response = await queries.removeFriend(relation.RELATIONID);
        }
        res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});

app.get('/getfriendship', async (req, res) => {
    if (req.query.petid && req.query.friendid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.query.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }

        var relation: Relationship|Response = await queries.getRelationshipBetweenPets(req.query.petid as unknown as number, req.query.friendid as unknown as number);
        if ("status" in relation) {
            return res.status(400).json({ status: res.statusCode, message: "There is no relationship" } as Response);
        } else {
            return res.status(200).json(relation as Relationship);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});

//Allowed Users: User
app.post('/sendattraktivrequest', async (req, res) => {

    if (req.body.petid && req.body.friendid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.sendAttraktivRequest(req.body.petid as unknown as number, req.body.friendid as unknown as number);
        return res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});

//Allowed Users: User
app.post('/removeattraktivrequest', async (req, res) => {

    if (req.body.petid && req.body.friendid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.removeAttraktivRequest(req.body.petid as unknown as number, req.body.friendid as unknown as number);
        return res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});

app.get('/getpetmatches', async (req, res) => {

    if (req.query.petid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.query.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response | Relationship[] = await queries.getPetMatches(req.query.petid as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Relationship[]);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "Missing PetID" } as Response);
    }
});

app.get('/getmessages', async (req, res) => {
    if (req.query.petid && req.query.chatpartnerid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.query.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response | Message[] = await queries.getMessages(req.query.petid as unknown as number, req.query.chatpartnerid as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Message[]);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "Missing atleast one of two arguments" } as Response);
    }
});

app.post('/sendMessage', async (req, res) => {

    if (req.body.petid && req.body.chatpartnerid && req.body.message) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.sendMessage(req.body.petid as unknown as number, req.body.chatpartnerid as unknown as number, req.body.message as unknown as string);
        return res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of three arguments" } as Response);
    }
});

app.get('/getchats', async (req, res) => {
    if (req.query.petid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.query.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response | Pet[] = await queries.getChats(req.query.petid as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Pet[]);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing petid" } as Response);
    }
});

app.get('/getlastmessage', async (req, res) => {
    if (req.query.petid && req.query.chatpartnerid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.query.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response | Message = await queries.getLastMessage(req.query.petid as unknown as number, req.query.chatpartnerid as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Message);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});

app.post('/addpreferences', async (req, res) => {
    if (req.body.petid && req.body.preferences) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.addPreferences(req.body.petid as unknown as number, req.body.preferences as unknown as number[]);
        return res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});

app.post('/removepreferences', async (req, res) => {
    if (req.body.petid && req.body.preferences) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.removePreferences(req.body.petid as unknown as number, req.body.preferences as unknown as number[]);
        return res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});

app.get('/getpreferences', async (req, res) => {
    if (req.query.petid) {
        var response: Response | Preference[] = await queries.getPreferences(req.query.petid as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Preference[]);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing PetID" } as Response);
    }
});

app.post('/deletechat', async (req, res) => {
    if (req.body.petid && req.body.chatpartnerid) {
        var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.petid as unknown as number);
        if (!isCorrectUser) {
            return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
        }
        var response: Response = await queries.deleteChat(req.body.petid as unknown as number, req.body.chatpartnerid as unknown as number);
        return res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});



app.post('/addreport', async (req, res) => {
    if (await queries.isUserAdmin(req.user)) {
        if (req.body.reportedpetid && req.body.reason) {
            var response: Response = await queries.addReport(req.body.reportedpetid as unknown as number, req.body.reason as unknown as string);
            return res.status(response.status).json(response);
        } else {
            res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
        }
    } else {
        res.status(403).json({ status: res.statusCode, message: "You are not an Admin" } as Response);
    }

});

app.post('/removepetreports', async (req, res) => {
    if (await queries.isUserAdmin(req.user)) {
        if (req.body.reportedpetid) {
            var isCorrectUser: boolean = await queries.authenticateByPetId(req.user, req.body.reportedpetid as unknown as number);
            if (!isCorrectUser) {
                return res.status(403).json({ status: res.statusCode, message: "You are not allowed to edit this user" } as Response);
            }
            var response: Response = await queries.removePetReports(req.body.reportedpetid as unknown as number);
            return res.status(response.status).json(response);
        } else {
            res.status(400).json({ status: res.statusCode, message: "You are missing reportedpetid" } as Response);
        }
    } else {
        res.status(403).json({ status: res.statusCode, message: "You are not an Admin" } as Response);
    }

});

app.get('/removereport', async (req, res) => {
    if (await queries.isUserAdmin(req.user)) {
        if (req.query.reportid) {

            var response: Response = await queries.removeReport(req.query.reportid as unknown as number);

            res.status(response.status).json(response);
        } else {
            res.status(400).json({ status: res.statusCode, message: "You are missing petid" } as Response);
        }

    } else {
        res.status(403).json({ status: res.statusCode, message: "You are not an Admin" } as Response);
    }
});

app.get('/getallreports', async (req, res) => {
    if (await queries.isUserAdmin(req.user)) {
        var response: Response | Report[] = await queries.getAllReports();
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Report[]);
        }
    } else {
        res.status(403).json({ status: res.statusCode, message: "You are not an Admin" } as Response);
    }

});

app.post('/banuser', async (req, res) => {
    if (await queries.isUserAdmin(req.user)) {
        if (req.body.userid) {
            var response: Response = await queries.banUser(req.body.userid as unknown as number, req.body.until);
            return res.status(response.status).json(response);
        } else {
            res.status(400).json({ status: res.statusCode, message: "You are missing userid" } as Response);
        }
    } else {
        res.status(403).json({ status: res.statusCode, message: "You are not an Admin" } as Response);
    }

});

app.post('/unbanuser', async (req, res) => {
    if (await queries.isUserAdmin(req.user)) {
        if (req.body.userid) {
            var response: Response = await queries.unbanUser(req.body.userid as unknown as number);
            return res.status(response.status).json(response);
        } else {
            res.status(400).json({ status: res.statusCode, message: "You are missing userid" } as Response);
        }
    } else {
        res.status(403).json({ status: res.statusCode, message: "You are not an Admin" } as Response);
    }
});

app.get('/getbannedusers', async (req, res) => {
    if (await queries.isUserAdmin(req.user)) {
        var response: Response | User[] = await queries.getBannedUsers();
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as User[]);
        }
    } else {
        res.status(403).json({ status: res.statusCode, message: "You are not an Admin" } as Response);
    }

});

app.get('/gettoppets', async (req, res) => {
    if (req.query.limit) {
        var response: Response | Relationship[] = await queries.getAllMatches();
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            var points: any = {}
            response.forEach(element => {
                if (element.RELATIONSHIP == "Matched") {
                    points[element.TIER_A_ID] = points[element.TIER_A_ID] ? points[element.TIER_A_ID] + 1 : 1;
                    points[element.TIER_B_ID] = points[element.TIER_B_ID] ? points[element.TIER_B_ID] + 1 : 1;
                } else if (element.RELATIONSHIP == "A requested B") {
                    points[element.TIER_A_ID] = points[element.TIER_A_ID] ? points[element.TIER_A_ID] + 1 : 1;
                } else if (element.RELATIONSHIP == "B requested A") {
                    points[element.TIER_B_ID] = points[element.TIER_B_ID] ? points[element.TIER_B_ID] + 1 : 1;
                } else if (element.RELATIONSHIP == "A removed B") {
                    points[element.TIER_A_ID] = points[element.TIER_A_ID] ? points[element.TIER_A_ID] + 1 : 1;
                } else if (element.RELATIONSHIP == "B removed A") {
                    points[element.TIER_A_ID] = points[element.TIER_A_ID] ? points[element.TIER_A_ID] + 1 : 1;
                }
            });
            var sortable = [];
            for (var petid in points) {
                sortable.push([petid, points[petid]]);
            }

            sortable.sort(function (a, b) {
                return b[1] - a[1];
            });
            console.log(sortable);
            sortable.reverse();
            var sortedPets: Pet[] = [];
            for (var i = 0; i < (req.query.limit as unknown as number); i++) {
                var id = sortable.pop() as [number, number];
                if (id == undefined) {
                    break;
                }
                var pet: Pet | Response = await queries.getPetByID(id[0]);
                if ("status" in pet) {
                    console.log(id[0]);
                    return res.status(pet.status).json(pet);
                } else {
                    pet.TOTALMATCHES = id[1];
                    sortedPets.push(pet as Pet);
                }
            }
            res.status(200).json(sortedPets as Pet[]);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing limit" } as Response);
    }
    
});

app.get('/getpreferences', async (req, res) => {
    if (req.query.petId) {
        var response: Response | Preference[] = await queries.getPreferences(req.query.petId as unknown as number);
        if ("status" in response) {
            res.status(response.status).json(response);
        } else {
            res.status(200).json(response as Preference[]);
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing petId" } as Response);
    }
});

app.get('/logout', (req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        tokenBlacklist.push(token);
    };
});

app.listen(port, () => console.log(`Lowoof API running on port ${port}!`));