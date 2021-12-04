import axios from 'axios';
import bcrypt from 'bcrypt';
export class Api {
    apiToken: string = "";
    url: string = "http://127.0.0.1:3000";
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
        var valid:boolean = false;
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
    isPasswordValid(password: string): boolean {
        return false;
    }

    async createNewUser(user: any): Promise<any> {
        var hashedPassword:string;
        var res:any;
        hashedPassword = await bcrypt.hash(user["PASSWORD"], 10);
        await axios.post(this.url + '/adduser', {
            username: user["USERNAME"],
            password: hashedPassword,
            email: user["EMAIL"],
            vorname: user["VORNAME"],
            nachname: user["NACHNAME"],
            geburtsdatum: user["GEBURTSTAG"],
            institution: user["INSTITUTION"],
            telefonnummer: user["TELEFONNUMMER"],
            plz: user["PLZ"],
            adresse: user["WOHNORT"],
            geschlecht: user["GESCHLECHT"],
          },{
              headers: {
            'Authorization': `Beaver ${this.apiToken}`
        }
        })
        .then(response => {if(response.status == 200){
              console.log(response.data);
              res = response.data;
          }else{
              res = response.data;
          }} )
          .catch((error) => { res = error }); //TODO remove console log
          return res;
        }

   async getProfileData(userId: number): Promise<any> {
        var res:any;
        var user:any;
        await axios.get(this.url + '/getuser?userid='+userId, {
            headers: {
                'Authorization': `Beaver ${this.apiToken}`
            }
        }).then(response => {res = response.data;})
        .catch((error) => {res = error; }); //TODO remove console log
        return res;
    }

    updateProfile(newProfile: any): void {
        return;
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
