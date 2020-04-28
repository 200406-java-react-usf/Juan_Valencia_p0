export class User {

    id: number;
    username: string;
    password: string;
    

    constructor(id: number, un: string, pw: string) {
        this.id = id;
        this.username = un;
        this.password = pw;
    }

}
