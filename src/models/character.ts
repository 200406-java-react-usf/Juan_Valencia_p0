export class Character {

    charId: number;
    charName: string;
    leagueName: string;
    rank: number;
    charLevel: number;
    accountName: string;

    constructor(charid: number, charname: string, lname: string, rank: number, clevel: number, acname: string) {
        this.charId = charid;
        this.charName = charname;
        this.leagueName = lname;
        this.rank = rank;
        this.charLevel = clevel;
        this.accountName = acname;
        
        
        

    }

}
