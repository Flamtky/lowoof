import { Api } from "../Frontend/src/Api/lowoof-api";
const api: Api = new Api();

async function start(){
    await api.getAuthTokenfromServer("username", "password"); //Needs to be called once to get the token
    createUser();
    profileData(1);
    validUsername("username");
    updateProfile(1);
}

//This creates a new user, you need to check if the username is valid 
//by urself
async function createUser() {
    var user:any = {
        USERNAME: 'nutzername',
        PASSWORD: 'sicheresPasswort',
        EMAIL: 'email@email.com',
        VORNAME: 'Max',
        NACHNAME: 'Mustermann',
        GEBURTSTAG: '2002-1-12',
        INSTITUTION: 'NULL',
        TELEFONNUMMER: 68468481446,
        PLZ: 50667,
        WOHNORT: 'Musterstraße 1',
        GESCHLECHT: 'Männlich',
      }
    if(await api.isUsernameValid(user["USERNAME"])){
        await api.createNewUser(user);
    }
}

//Returns the profile data as Object
//Access like profileData["VORNAME"]
async function profileData(userId: number) {
    var profileData:any = await api.getProfileData(userId);
    console.log(profileData);
}

//Returns true if the username is valid
async function validUsername(username:string) {
    var isValid:boolean = await api.isUsernameValid(username);
}

//Changes Attributes of a user. In this case we print the old data,
//change it and then print the new data
//The update profile Data cant update the password, Profilepicture and the userId
async function updateProfile(userID:number){
    var user:any = await api.getProfileData(userID);
    console.log(user);
    user["GESCHLECHT"] = "Weiblich";
    await api.updateProfile(user);
    var user:any = await api.getProfileData(userID);
    console.log(user);
}