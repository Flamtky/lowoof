import axios from 'axios';
import bcrypt from 'react-native-bcrypt';
import { User, Response, Pet, Relationship } from './interfaces';
export class Api {
    private apiToken: string = "";
    private url: string = "http://server.it-humke.de:8080";
    constructor() { }

    /**
     * @param username: string Username of the Api-User
     * @param password: string Clear text Password of the Api-User
     * 
     * This function logs in the given user and returns a Auth Token.
     * This Token is needed for all further requests to the API.
     * The function saves the Auth Token in the Api-Object.
    */
    async getAuthTokenfromServer(username: string, password: string) {
        try {
            return await axios.get(this.url + '/auth?username=' + username + '&password=' + password).then(response => { this.setAuthToken(response.data); });
        } catch (error) {
            this.setAuthToken("Error contact admin");
            return "Error"
        }
    }

    private setAuthToken(token: string) {
        this.apiToken = token;
    }

    /**
     * @returns {string} The current Auth Token
     */
    getAuthToken() {
        return this.apiToken;
    }

    isSessionIDValid(sessionID: string): boolean {
        return false;
    }

    destroySession(sessionID: string): void {
        return;
    }

    /**
     * @param username :string Username to check
     * @returns {boolean} true if username is available, false if not
     */
    async isUsernameValid(username: string): Promise<boolean> {
        var valid: boolean = false;
        await axios.get(this.url + '/users', {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        }).then(response => {
            response.data.forEach((element: any) => {
                console.log(element['USERNAME']);
                if (element['USERNAME'] == username) {
                    console.log("Username is already taken");
                    valid = false;
                } else valid = true;
            });
        }).catch((error) => { console.log(error); throw new Error("Error while connecting to server. Are you authorized?"); }); //TODO remove console log
        return valid;
    }
    //TODO
    isLoginValid(password: string): boolean {
        return false;
    }

    /**
     * Creates a new User in the Database
     * @param user :User User object to save to the database
     * @returns {Response}  Response object with message from the server
     */
    async createNewUser(user: User): Promise<Response> {
        var hashedPassword: string;
        var res: Response = { message: "Error" };
        if (user["PASSWORD"] == null) {
            return { message: "Password is missing" };
        }
        await bcrypt.hash(user["PASSWORD"], 12, async (err: any, hash: any) => {
            if (err) throw err;
            user["PASSWORD"] = hash;
            await axios.post(this.url + '/adduser', user, {
                headers: {
                    'Authorization': `Beaver ${this.apiToken}`
                }
            })
                .then(response => {
                    if (response.status == 200) {
                        res = response.data;
                    } else {
                        res = response.data;
                    }
                })
                .catch((error) => { res = error });
        });
        return res;
    }

    /**
     * Gets Profile Data of a User except the the hashed password
     * @param userId :number UserID of the User to get the Profile of
     * @returns {User|Response} User Object if the user is found else a Response Object with the message from the server
     */
    async getProfileData(userId: number): Promise<User | Response> {
        var res: User | Response = { message: "Something bad happend :(" };
        await axios.get(this.url + '/getuser?userid=' + userId, {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        }).then(response => { if (response.data > 1) { res = { message: "Es wurden mehrere User gefunden" } }; res = response.data[0]; })
            .catch((error) => { res = error; }); //TODO remove console log
        return res;
    }

    /**
     * Updates the Profile of a User except the userId,password,profilePicture
     * [CAUTION]    Password Attribute must be set!
     * @param newProfile :User Updated User Object
     * @returns {Response} Response Object with message from the server
     */
    async updateProfile(newProfile: User): Promise<Response> {
        var res: Response = { message: "Error" };
        //newProfile["GEBURTSTAG"] = newProfile["GEBURTSTAG"].toISOString();
        await axios.post(this.url + '/updateuser', newProfile, {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        })
            .then(response => {
                if (response.status == 200) {
                    res = response.data;
                } else {
                    res = response.data;
                }
            })
            .catch((error) => { res = error });
        return res;
    }

    /**
     * Returns a Array of Users relationships but there are only UserIDs no usernames in the Response
     * @param userId :number UserID of the User to get the relationships of
     * @returns {Relationship[] | Response} Array of Relationships or Response Object with the message from the server
     */
    async getPetRelationships(petId: number): Promise<Relationship[] | Response> {
        var res: Relationship[] | Response = { message: "Error" };
        await axios.get(this.url + '/getpetrelationships?petid=' + petId, {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        }).then(response => {
            if (response.status == 200) {
                res = response.data as Relationship[];
            } else {
                res = response.data as Response;
            }
        }).catch((error) => { res = error });
        return res;
    }

    /**
     * 
     * @param userId :number UserID of the Pet Owner
     * @returns {Pet[] | Response} Array of owned Pets. If something goes wrong a Response Object with the message from the server will be returned
     */
    async getUserPets(userId: number): Promise<Pet[] | Response> {
        var res: Pet[] | Response = { message: "Error" };
        await axios.get(this.url + '/getuserpets?userid=' + userId, {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        }).then(response => {
            if (response.status == 200) {
                res = response.data as Pet[];
            } else {
                res = response.data as Response;
            }
        }).catch((error) => { res = error });
        return res;
    }

    /**
     * Gets the Profile data of a Pet
     * @param petId :number PetID of the Pet to get the Profile data of
     * @returns {Pet | Response} Pet Object if the pet is found else a Response Object with the message from the server
     */
    async getPetData(petId: number): Promise<Pet | Response> {
        var res: Pet | Response = { message: "Error" };
        await axios.get(this.url + '/getpet?petid=' + petId, {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        }).then(response => {
            if (response.status == 200) {
                res = response.data as Pet;
            } else {
                res = response.data as Response;
            }
        }).catch((error) => { res = error });
        return res;
    }

    /**
     * Deletes a User from the Database. If a User is deleted all his Pets and Relationships will be deleted too
     * @param userId :number UserID to delete from the database
     * @param pwd :string Password of the User to delete
     * @returns {Response} Response Object with message from the server
     */
    async deleteUser(userId: number, pwd: string): Promise<Response> {
        var res: Response = { message: "Something bad happend :(" };
        await axios.post(this.url + '/deleteuser', { userid: userId, password: pwd }, {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        }).then(response => { res = response.data as Response; })
            .catch((error) => { res = error; });
        return res;
    }

    /**
     * Deletes a pet from the Database
     * @param petId :number PetID of the Pet to delete
     * @param pwd :string Password of the User who owns the Pet
     * @returns {Response} Response Object with message from the server
     */
    async deletePet(petId: number,pwd:string): Promise<Response> {
        var res:Response = { message: "Something bad happend :(" };
        if(pwd.length < 1){
            res = {message: "Password not set"};
        }else{
            await axios.post(this.url + '/deletepet',{petid:petId,password:pwd}, {
                headers: {
                    'Authorization': `Beaver ${this.apiToken}`
                }
            }).then(response => {res = response.data as Response; })
                .catch((error) => { res = error.response.data; });
        }
        return res;
    }

    createPetProfile(newPet: Pet): void {
        return;
    }

    addFriend(userId: number, friendId: number): void {
        return;
    }

    removeFriend(userId: number, friendId: number): void {
        return;
    }

    addReport(userId: number, reason: string): void {
        return;
    }

    likePet(linkingPetId: number, petId: number): void {
        return;
    }

    dislikePet(dislinkingPetId: number, petId: number): void {
        return;
    }

    getChats(userId: number): any {
        return;
    }

    removeChat(deletingUserId: number, userId: number): void {
        return;
    }

    getPets(userId: number): any {
        return;
    }

    getMatches(userId: number): any {
        return;
    }

    getMessages(userId: number, toUserId: number): any {
        return;
    }

    sendMessage(userId: number, toUserId: number, message: string): void {
        return;
    }

    pauseProfile(userId: number): void {
        return;
    }
}
