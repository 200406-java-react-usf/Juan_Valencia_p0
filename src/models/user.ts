export class User {

    id: number;
    username: string;
    password: string;
    account_name: string;

    constructor(id: number, un: string, pw: string, acn: string) {
        this.id = id;
        this.username = un;
        this.password = pw;
        this.account_name = acn;
    }

}
