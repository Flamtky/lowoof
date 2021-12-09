import express, { response } from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { User, Response, Pet, Relationship } from './interfaces'
import Queries from "./sqlqueries"
dotenv.config({ path: './vars.env' });

const queries = new Queries();
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
app.get('/users', async(req, res) => {
    var response:Response|User[] = await queries.getAllUsers();
    
    if(response instanceof Response){
        res.status(response.status).json(response);
    }else{
        res.status(200).json(response);
    }
    

});
//Allowed Users: All Users
app.get('/getuser', async(req, res) => {
    if (req.query.userid) {
        var response:Response | User = await queries.getUserByID(req.query.userid as unknown as number)
            if("status" in response){
                res.status(response.status).json(response);
            }else{
                res.status(200).json(response);
            }
    }else{
        return res.status(400).json({ status: res.statusCode, message: "Missing UserID" } as Response);
    }
});
//Allowed Users: Everyone
app.post('/adduser', async(req, res) => {
    console.log(req.body);
    const user: User = req.body;
    var response: Response = await queries.addUser(user);
    console.log(response);
    return res.status(response.status).json(response);
});
//Allowed Users: User
app.post('/updateuser', async(req, res) => {
    console.log(req.body);
    const user: User = req.body;
    var response: Response = await queries.updateUser(user);
    return res.status(response.status).json(response);
});

//Allowed Users: User
app.get('/getpetrelationships', async(req, res) => {
    if (req.query.petid) {
        var response: Response | Relationship[] = await queries.getPetRelationships(req.query.petid as unknown as number);
        if("status" in response){
            res.status(response.status).json(response);
        }else{
            res.status(200).json(response as Relationship[]);
        }
    }else{
        res.status(400).json({ status: res.statusCode, message: "Missing PetID" } as Response);
    }
});

//Allowed Users: User
app.get('/getuserpets', async(req, res) => {
    if (req.query.userid) {
        var response: Response | Pet[] = await queries.getUserPets(req.query.userid as unknown as number);
        if("status" in response){
            res.status(response.status).json(response);
        }else{
            res.status(200).json(response as Pet[]);
        }

    }else{
        res.status(400).json({ status: res.statusCode, message: "Missing UserID" } as Response);
    }

});
//Allowed Users: All Users
app.get('/getpet', async(req, res) => {
    if (req.query.petid) {
        var response: Response | Pet = await queries.getPetByID(req.query.petid as unknown as number);
        if("status" in response){
            res.status(response.status).json(response);
        }else{
            res.status(200).json(response as Pet);
        }

    }else{
        res.status(400).json({ status: res.statusCode, message: "Missing PetID" } as Response);
    }
});
//Allowed Users: User
app.post('/deleteuser', async(req, res) => {
    console.log("Delete User " + req.body.userid + "...");
    if (req.body.userid) {
        const connection: mysql.Pool = getConnection();
        var pets:Response | Pet[] = await queries.getUserPets(req.body.userid as unknown as number);
        if("status" in pets){
            return res.status(pets.status).json(pets);
        }
        console.log("Deleting Users Pets Relationships...");
        pets.forEach(async element => {
            await queries.deletePetRelationships(element.TIERID);
        });
        console.log("Deleting Users Pets...");
        await queries.deleteUserPets(req.body.userid as unknown as number);
        console.log("Deleting User...");
        var response:Response = await queries.deleteUser(req.body.userid as unknown as number);
        console.log("Finished Deleting User");
        return res.status(response.status).json(response);
        
    }else{
        res.status(400).json({ status: res.statusCode, message: "Missing UserID" } as Response);
    }
});
//Allowed Users: User
app.post('/deletepet', async(req, res) => {
    if (req.body.petid) {
        await queries.deletePetRelationships(req.body.petid as unknown as number);
        var response: Response = await queries.deletePet(req.body.petid as unknown as number);
        return res.status(response.status).json(response);
    }else{
        res.status(400).json({ status: res.statusCode, message: "Missing PetID" } as Response);
    }
});
//Allowed Users: User
app.post('/sendfriendrequest', async(req, res) => {
    if (req.body.petid && req.body.friendid) {
        var response: Response = await queries.sendFriendRequest(req.body.petid as unknown as number, req.body.friendid as unknown as number);
        return res.status(response.status).json(response);
    } else {
        res.status(400).json({ status: res.statusCode, message: "You are missing atleast one of two arguments" } as Response);
    }
});
//Allowed Users: User
app.post('/acceptfriendrequest', async(req, res) => {
    if (req.body.petid && req.body.friendid) {
        var relation: Relationship | Response = await queries.getRelationshipBetweenPets(req.body.petid as unknown as number, req.body.friendid as unknown as number);
        if("status" in relation){
            return res.status(relation.status).json(relation);
        }else if(relation.RELATIONSHIP == "Friends"){
            return res.status(400).json({ status: res.statusCode, message: "You are already friends" } as Response);
        }else{
            if(relation.RELATIONSHIP.startsWith("A") && req.body.petid == relation.TIER_B_ID || relation.RELATIONSHIP.startsWith("B") && req.body.petid == relation.TIER_A_ID){
                var response: Response = await queries.acceptFriendRequest(relation.RELATIONID);
                res.status(response.status).json(response);
            }else{
                return res.status(400).json({ status: res.statusCode, message: "You are not the requested" } as Response);
            }
        }
    } else {
        res.status(400).json({ status: res.statusCode, message: "You didnt provide the required informations" } as Response);
    }
});

app.listen(port, () => console.log(`Lowoof API running on port ${port}!`));