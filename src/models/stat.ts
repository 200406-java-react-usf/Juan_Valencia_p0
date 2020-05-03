export class Stat {

    statId: number;
    avgRank: number;
    avgCharLevel: number;
    improved: boolean;
    createdOn: string;
    account_name: string;

    constructor(statid: number, arank: number, acl: number, imp: boolean, createdon: string, cname: string) {
        this.statId = statid;
        this.avgRank = arank;
        this.avgCharLevel = acl;
        this.improved = imp;
        this.createdOn = createdon;
        this.account_name = cname;
    }

}
