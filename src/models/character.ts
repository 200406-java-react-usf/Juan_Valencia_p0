export class Character {

    charId: number;
    userId: number;
    charName: string;
    leagueName: string;
    rank: number;
    charLevel: number;


    constructor(ci: number, ui: number, cn: string, ln: string, rank: number, cl: number) {
        this.charId = ci;
        this.userId = ui;
        this.charName = cn;
        this.leagueName = ln;
        this.rank = rank;
        this.charLevel = cl;

    }

}
