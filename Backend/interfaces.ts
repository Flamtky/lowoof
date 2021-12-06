export interface User {
    USERID: number;
    SPRACHID: string;
    USERNAME: string;
    EMAIL: string;
    PASSWORD?: string;
    VORNAME: string;
    NACHNAME: string;
    GEBURTSTAG: Date;
    INSTITUTION: string;
    TELEFONNUMMER: string;
    PLZ: number;
    WOHNORT: string;
    GESCHLECHT: string;
    PROFILBILD: string;
    ONLINESTATUS: number;
    MITGLIEDSCHAFTPAUSIERT: number;
}

export interface Response {
    message: string;
}