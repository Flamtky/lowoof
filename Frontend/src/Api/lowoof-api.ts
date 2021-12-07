import axios from 'axios';
import bcrypt from 'react-native-bcrypt';
import { User, Response, Pet } from './interfaces';
export class Api {
    apiToken: string = "";
    url: string = "http://server.it-humke.de:8080";
    constructor() { }

    async getAuthTokenfromServer(username: string, password: string) {
        try {
            return await axios.get(this.url + '/auth?username=' + username + '&password=' + password).then(response => { this.setAuthToken(response.data); });
        } catch (error) {
            this.setAuthToken("Error contact admin");
            return "Error"
        }
    }
    
    setAuthToken(token: string) {
        this.apiToken = token;
    }

    getAuthToken() {
        return this.apiToken;
    }

    isSessionIDValid(sessionID: string): boolean {
        return false;
    }

    destroySession(sessionID: string): void {
        return;
    }

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
    //TODO Klartext mit Hash in der Datenbank abgleichen? Dann müsste noch ein User übergeben werden
    isLoginValid(password: string): boolean {
        return false;
    }

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

    async getUserRelationships(userId: number): Promise<any> {
        var res: any = { message: "Error" };
        await axios.get(this.url + '/getuserrelationships?userid=' + userId, {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        }).then(response => {
            if (response.status == 200) {
                res = response.data;
            } else {
                res = response.data;
            }
        }).catch((error) => { res = error });
        return res;
    }

    async getUserPets(userId: number): Promise<Pet | Response> {
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

    deleteUser(userId: number): void {
        return;
    }

    createPetProfile(petProfile: any): void {
        return;
    }

    getFriends(userId: number): any {
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
