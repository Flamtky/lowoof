export interface User {
    USERID: number,
    SPRACHID: string,
    USERNAME: string,
    EMAIL: string,
    PASSWORD?: string,
    VORNAME: string,
    NACHNAME: string,
    GEBURTSTAG: string,
    INSTITUTION: string,
    TELEFONNUMMER: string,
    PLZ: number,
    WOHNORT: string,
    GESCHLECHT: string,
    PROFILBILD: any,
    ONLINESTATUS: number,
    MITGLIEDSCHAFTPAUSIERT: number,
    BANNEDUNTIL?: Date,
    ADMIN: number,
}

export interface Pet {
    TIERID: number,
    USERID: number,
    NAME: string,
    ART: string,
    RASSE: string,
    GESCHLECHT: string,
    GEBURTSTAG: string,
    PROFILBILD: any,
    USERNAME?: string,
    TOTALMATCHES?: number,
}

export interface Relationship {
    RELATIONID: number,
    TIER_A_ID: number,
    TIER_B_ID: number,
    RELATIONSHIP: string,
}

export interface Response {
    status: number,
    message: string,
}

export interface Message {
    NACHRICHTENID: string,
    NACHRICHT: string,
    FROM_PET: number,
    TO_PET: number,
    TIMESTAMP: string,
}

export interface Preference {
    ID: number,
    PREF: string,
}

export interface Report {
    REPORTID: number,
    TIERID: number,
    TIMESTAMP?: string,
    GRUND: string,
}