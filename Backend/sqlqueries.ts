import mysql, { Pool } from 'mysql';
import dotenv from 'dotenv';
import { User, Response, Pet, Relationship } from './interfaces'
dotenv.config({ path: './vars.env' });

export default class Queries {
    mySqlHost: string = process.env.MYSQL_HOST ?? '';
    mySqlPort: string = process.env.MYSQL_PORT ?? '';
    mySqlUser: string = process.env.MYSQL_USER ?? '';
    mySqlPassword: string = process.env.MYSQL_PWD ?? '';
    mySqlDatabase: string = process.env.MYSQL_DB ?? '';

    errorResponse: Response = { status: 500, message: "Something went wrong, Try again or contact the administrator" };

    sqlcon: mysql.Pool = mysql.createPool({
        connectionLimit: 10,
        host: this.mySqlHost,
        port: this.mySqlPort as unknown as number,
        user: this.mySqlUser,
        password: this.mySqlPassword,
        database: this.mySqlDatabase
    });

    getConnection(): mysql.Pool {
        return this.sqlcon

    }

    async getAllUsers(): Promise<Response | User[]> {
        return new Promise<Response | User[]>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            var response: Response | User[] = { status: 0, message: '' };
            connection.query(`SELECT * FROM USER`,
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        response = this.errorResponse
                        resolve(response);
                    } else {
                        response = rows as User[];
                        resolve(response);
                    }
                }
            );
        });

    }

    async getUserByID(id: number): Promise<Response | User> {
        return new Promise<Response | User>((resolve, reject) => {
            var response: Response | User = { status: 0, message: '' };
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT * FROM USER WHERE USERID = ?`, [id], (err, rows, fields) => {
                if (err) {
                    console.log(err + "\n---------NOT FATAL----------\n");
                    resolve(this.errorResponse);
                } else {
                    console.log(rows);
                    delete rows[0].PASSWORD;
                    resolve(rows[0] as User);
                }
            });
        });
    }

    async getUserLanguage(id: number): Promise<Response | string> {
        return new Promise<Response | string>((resolve, reject) => {
            var response: Response | string = { status: 0, message: '' };
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT USER.SPRACHID, SPRACHE.SPRACHE FROM USER LEFT JOIN SPRACHE on USER.SPRACHID = SPRACHE.SPRACHID WHERE USERID = ?;`, [id],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err + "\n---------NOT FATAL----------\n");
                        resolve(this.errorResponse);
                    } else {
                        if(rows.length > 0 && rows[0].SPRACHE != null) {
                            resolve(rows[0].SPRACHE as string);
                        }else{
                            resolve({status: 404, message: "User has invalid SPRACHID"} as Response);
                        }

                        
                    }
                });
        });
    }

    async addUser(user: User): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            var response: Response = { status: 0, message: '' };
            connection.query(`INSERT INTO USER (USERNAME, PASSWORD, EMAIL, VORNAME, NACHNAME, GEBURTSTAG, INSTITUTION, TELEFONNUMMER, PLZ, WOHNORT, GESCHLECHT, ONLINESTATUS, MITGLIEDSCHAFTPAUSIERT)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
                [user["USERNAME"], user["PASSWORD"], user["EMAIL"], user["VORNAME"], user["NACHNAME"], user["GEBURTSTAG"], user["INSTITUTION"], user["TELEFONNUMMER"], user["PLZ"], user["WOHNORT"], user["GESCHLECHT"]],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        response = this.errorResponse
                        resolve(response);
                    } else {
                        response = { status: 200, message: "User successfully added" };
                        resolve(response);
                    }
                });
        }
        );
    }

    async updateUser(user: User): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`UPDATE USER SET SPRACHID = ?, USERNAME = ?, EMAIL = ?, VORNAME = ?, NACHNAME = ?, GEBURTSTAG = ?, INSTITUTION = ?,
                                    TELEFONNUMMER = ?, PLZ = ?, WOHNORT = ?, GESCHLECHT = ?, ONLINESTATUS = ?, MITGLIEDSCHAFTPAUSIERT = ? WHERE USERID = ?;`,
                [user["SPRACHID"], user["USERNAME"], user["EMAIL"], user["VORNAME"], user["NACHNAME"], user["GEBURTSTAG"], user["INSTITUTION"], user["TELEFONNUMMER"], user["PLZ"], user["WOHNORT"], user["GESCHLECHT"], user["ONLINESTATUS"], user["MITGLIEDSCHAFTPAUSIERT"], user["USERID"]],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: 'User edited' } as Response);
                    }
                }
            );
        });
    }

    async getPetRelationships(petid: number): Promise<Response | Relationship[]> {
        return new Promise<Response | Relationship[]>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT * FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = ? OR TIER_B_ID = ?;`, [petid, petid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve({ status: 500, message: "Something went wrong, Try again or contact the administrator" } as Response);
                    } else {
                        resolve(rows as Relationship[]);//TODO: Add Pet Relationships as Interface
                    }
                }
            );
        });
    }

    async getUserPets(userid: number): Promise<Response | Pet[]> {
        return new Promise<Response | Pet[]>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT * FROM TIER WHERE USERID = ?;`, [userid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse)
                    } else {
                        resolve(rows as Pet[]);
                    }
                }
            );
        });
    }

    async getPetByID(petid: number): Promise<Response | Pet> {
        return new Promise<Response | Pet>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT TIER.*, USER.USERNAME FROM TIER LEFT JOIN USER on TIER.USERID = USER.USERID WHERE TIERID = ?; `, [petid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse)
                    } else {
                        if (rows.length == 0) {
                            resolve({ status: 400, message: "Pet not Found" });
                        } else {
                            resolve(rows[0] as Pet);
                        }
                    }
                }
            );
        });
    }
    async deletePetRelationships(petid: number): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`DELETE FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = ? OR TIER_B_ID = ?;`, [petid, petid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: "Relationships deleted" } as Response);
                    }
                }
            );
        });
    }

    async deleteUserPets(userid: number): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`DELETE FROM TIER WHERE USERID = ?;`, [userid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: "Pets deleted" } as Response);
                    }
                }
            );
        });
    }

    async deleteUser(userid: number): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`DELETE FROM USER WHERE USERID = ?;`, [userid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: "User deleted" } as Response);
                    }
                }
            );
        });
    }

    async deletePet(petid: number): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`DELETE FROM TIER WHERE TIERID = ?;`, [petid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: "Pet deleted" } as Response);
                    }
                }
            );
        });
    }

    async sendFriendRequest(petid: number, friendid: number): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            var TIER_A_ID: number;
            var TIER_B_ID: number;
            var RELATIONSHIP: string;
            var RELATIONID: number;
            if (petid < friendid) {
                TIER_A_ID = petid;
                TIER_B_ID = friendid;
                RELATIONSHIP = "A requested B";
            } else {
                TIER_A_ID = friendid;
                TIER_B_ID = petid;
                RELATIONSHIP = "B requested A";
            }
            RELATIONID = (`${TIER_A_ID}${TIER_B_ID}`) as unknown as number;
            connection.query(`INSERT INTO TIER_RELATIONSHIPS (RELATIONID, TIER_A_ID, TIER_B_ID, RELATIONSHIP) VALUES (?,?, ?, ?);`, [RELATIONID, TIER_A_ID, TIER_B_ID, RELATIONSHIP],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: 'Friend request sent' } as Response);
                    }
                }
            );
        });
    }

    async getRelationshipByID(relationid: number): Promise<Response | Relationship> {
        return new Promise<Response | Relationship>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT * FROM TIER_RELATIONSHIPS WHERE RELATIONID = ?;`, [relationid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse)
                    } else {
                        if (rows.length == 0) {
                            resolve({ status: 400, message: "Relationship not Found" });
                        } else {
                            resolve(rows[0] as Relationship);
                        }
                    }
                }
            );
        });
    }

    async getRelationshipBetweenPets(petid: number, friendid: number): Promise<Response | Relationship> {
        return new Promise<Response | Relationship>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            var TIER_A_ID: number;
            var TIER_B_ID: number;
            var RELATIONID: number;
            if (petid < friendid) {
                TIER_A_ID = petid;
                TIER_B_ID = friendid;
            } else {
                TIER_A_ID = friendid;
                TIER_B_ID = petid;
            }
            RELATIONID = (`${TIER_A_ID}${TIER_B_ID}`) as unknown as number;
            connection.query(`SELECT * FROM TIER_RELATIONSHIPS WHERE RELATIONID = ?;`, [RELATIONID],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse)
                    } else {
                        if (rows.length == 0) {
                            resolve({ status: 400, message: "Relationship not Found" });
                        } else {
                            resolve(rows[0] as Relationship);
                        }
                    }
                }
            );
        });
    }

    async acceptFriendRequest(relationid: number): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            var RELATIONSHIP: string = "Friends";
            const connection: mysql.Pool = this.getConnection();
            connection.query(`UPDATE TIER_RELATIONSHIPS SET RELATIONSHIP = ? WHERE TIER_RELATIONSHIPS.RELATIONID = ?;`, [RELATIONSHIP, relationid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: 'Friend request accepted' } as Response);
                    }
                }
            );
        });

    }

    async removeFriend(relationid: number): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`DELETE FROM TIER_RELATIONSHIPS WHERE RELATIONID = ?;`, [relationid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: 'Friend removed' } as Response);
                    }
                }
            );
        });
    }

    async authenticateByUserObject(tokenUser: any, user: User): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT PASSWORD FROM USER WHERE USERNAME = ?`, [user.USERNAME],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else {
                        if (rows.length != 0) {
                            if (tokenUser.username === rows[0].USERNAME && tokenUser.password === rows[0].PASSWORD) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        } else {
                            resolve(false);
                        }

                    }
                }
            );
        });
    }

    async authenticateByUserId(tokenUser: any, userId: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT USERNAME, PASSWORD FROM USER WHERE USERID = ?`, [userId],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else {
                        if (rows.length != 0) {
                            if (tokenUser.username === rows[0].USERNAME && tokenUser.password === rows[0].PASSWORD) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        } else {
                            resolve(false);
                        }


                    }
                }
            );
        });
    }

    async authenticateByPetId(tokenUser: any, petId: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT USERID FROM TIER WHERE TIERID = ?`, [petId],
                async (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else {
                        if (rows.length != 0) {
                            var isLoggedIn: boolean = await this.authenticateByUserId(tokenUser, rows[0].USERID);
                            resolve(isLoggedIn);
                        } else {
                            resolve(false);
                        }

                    }
                }
            );
        });
    }

    async getPetMatches(petid: number): Promise<Response | Relationship[]> {
        return new Promise<Response | Relationship[]>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`SELECT * FROM TIER_RELATIONSHIPS WHERE TIER_A_ID = ? OR TIER_B_ID = ?;`, [petid, petid],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse)
                    } else {
                        resolve(rows as Relationship[]);
                    }
                }
            );
        });
    }

    async getMatchBetweenPets(petid: number, friendid: number): Promise<Response | Relationship> {
        return new Promise<Response | Relationship>((resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            var TIER_A_ID: number;
            var TIER_B_ID: number;
            var RELATIONID: number;
            if (petid < friendid) {
                TIER_A_ID = petid;
                TIER_B_ID = friendid;
            } else {
                TIER_A_ID = friendid;
                TIER_B_ID = petid;
            }
            RELATIONID = (`${TIER_A_ID}${TIER_B_ID}`) as unknown as number;
            connection.query(`SELECT * FROM TIER_RELATIONSHIPS WHERE RELATIONID = ?;`, [RELATIONID],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse)
                    } else {
                        if (rows.length == 0) {
                            resolve({ status: 404, message: "Relationship not Found" });
                        } else {
                            resolve(rows[0] as Relationship);
                        }
                    }
                }
            );
        });
    }

    async sendAttraktivRequest(petid: number, friendid: number): Promise<Response> {
        return new Promise<Response>(async (resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            var relation: Relationship | Response = await this.getMatchBetweenPets(petid, friendid);
            if ("status" in relation) {
                if (relation.status != 404) {
                    resolve(relation);
                } else {
                    var TIER_A_ID: number;
                    var TIER_B_ID: number;
                    var RELATIONSHIP: string;
                    var RELATIONID: number;
                    if (petid < friendid) {
                        TIER_A_ID = petid;
                        TIER_B_ID = friendid;
                        RELATIONSHIP = "A requested B";
                    } else {
                        TIER_A_ID = friendid;
                        TIER_B_ID = petid;
                        RELATIONSHIP = "B requested A";
                    }
                    RELATIONID = (`${TIER_A_ID}${TIER_B_ID}`) as unknown as number;
                    connection.query(`INSERT INTO TIER_MATCHES (RELATIONID, TIER_A_ID, TIER_B_ID, RELATIONSHIP) VALUES (?,?, ?, ?);`, [RELATIONID, TIER_A_ID, TIER_B_ID, RELATIONSHIP],
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                resolve(this.errorResponse);
                            } else {
                                resolve({ status: 200, message: 'Match request sent' } as Response);
                            }
                        }
                    );
                }

            } else {
                var RELATIONSHIP: string = "";
                if (relation.RELATIONSHIP == "Matched") {
                    resolve({ status: 400, message: "You are already Matched" });
                } else if (relation.RELATIONSHIP == "A requested B" && relation.TIER_B_ID == petid) {
                    RELATIONSHIP = "Matched";
                } else if (relation.RELATIONSHIP == "B requested A" && relation.TIER_A_ID == petid) {
                    RELATIONSHIP = "Matched";
                } else if (relation.RELATIONSHIP == "A removed B" && relation.TIER_A_ID == petid) {
                    RELATIONSHIP = "Matched";
                } else if (relation.RELATIONSHIP == "B removed A" && relation.TIER_B_ID == petid) {
                    RELATIONSHIP = "Matched";
                } else {
                    resolve({ status: 500, message: "Someone messed Up" });
                }
                connection.query(`UPDATE TIER_MATCHES SET RELATIONSHIP=? WHERE RELATIONID = ?;`, [RELATIONSHIP, relation.RELATIONID],
                    (err, rows, fields) => {
                        if (err) {
                            console.log(err);
                            resolve(this.errorResponse);
                        } else {
                            resolve({ status: 200, message: 'You just matched' } as Response);
                        }
                    }
                );

            }
        });
    }

    async removeAttraktivRequest(petid: number, friendid: number): Promise<Response> {
        return new Promise<Response>(async (resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            var relation: Relationship | Response = await this.getMatchBetweenPets(petid, friendid);
            if ("status" in relation) {
                resolve(relation);
            } else {
                var removeRelation: boolean = false;
                var RELATIONSHIP: string = "";
                if (relation.RELATIONSHIP == "Matched") {
                    if (relation.TIER_B_ID == petid) {
                        RELATIONSHIP = "B removed A";
                    } else if (relation.TIER_A_ID == petid) {
                        RELATIONSHIP = "A removed B";
                    }
                    connection.query(`UPDATE TIER_MATCHES SET RELATIONSHIP=? WHERE RELATIONID = ?;`, [RELATIONSHIP, relation.RELATIONID],
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                resolve(this.errorResponse);
                            } else {
                                resolve({ status: 200, message: 'You just matched' } as Response);
                            }
                        }
                    );

                } else if (relation.RELATIONSHIP == "A requested B" && relation.TIER_A_ID == petid) {
                    removeRelation = true;
                } else if (relation.RELATIONSHIP == "B requested A" && relation.TIER_B_ID == petid) {
                    removeRelation = true;
                } else if (relation.RELATIONSHIP == "A removed B" && relation.TIER_B_ID == petid) {
                    removeRelation = true;
                } else if (relation.RELATIONSHIP == "B removed A" && relation.TIER_A_ID == petid) {
                    removeRelation = true;
                } else {
                    resolve({ status: 500, message: "Someone messed Up" });
                }
                if (removeRelation) {
                    connection.query(`DELETE FROM TIER_MATCHES WHERE RELATIONID = ?;`, [relation.RELATIONID],
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                resolve(this.errorResponse);
                            } else {
                                resolve({ status: 200, message: 'You just lost a possible Match' } as Response);
                            }
                        }
                    );
                }
            }
        });
    }

    async addPet(pet: Pet): Promise<Response> {
        return new Promise<Response>(async (resolve, reject) => {
            const connection: mysql.Pool = this.getConnection();
            connection.query(`INSERT INTO TIER (USERID, NAME, ART, RASSE, GESCHLECHT, GEBURTSTAG, PROFILBILD) VALUES (?, ?, ?, ?, ?, ?, BINARY(?));`, [pet.USERID, pet.NAME, pet.ART, pet.RASSE, pet.GESCHLECHT, pet.GEBURTSTAG, pet.PROFILBILD],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        resolve(this.errorResponse);
                    } else {
                        resolve({ status: 200, message: 'Pet added' } as Response);
                    }
                }
            );
        });
    }
}



