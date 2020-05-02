export class Stat {

    statId: number;
    userId: number;
    avgRank: number;
    avgCharLevel: number;
    improved: boolean;
    createdOn: string;


    constructor(statid: number, userId: number, arank: number, acl: number, imp: boolean, createdon: string) {
        this.statId = statid;
        this.userId = userId;
        this.avgRank = arank;
        this.avgCharLevel = acl;
        this.improved = imp;
        this.createdOn = createdon;

    }

}
