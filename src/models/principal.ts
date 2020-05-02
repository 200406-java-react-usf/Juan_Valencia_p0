export class Principal {
    user_id: number;
    username: string;
    account_name: string;

    constructor(id: number, un: string, an: string) {
        this.user_id = id;
        this.username = un;
        this.account_name = an;
    }
}
