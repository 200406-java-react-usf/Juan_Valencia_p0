import { User } from "../models/user";
import { UserRepository } from "../repos/user-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { BadRequestError, ResourceNotFoundError, NotImplementedError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { query } from "express";

export class UserService {

    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    async getAllUsers(): Promise<User[]> {

            let users = await this.userRepo.getAll();

            if (users.length == 0) {
                throw new ResourceNotFoundError();
            }

            return users.map(this.removePassword);


    }

    async getUserById(id: number): Promise<User> {

            if (!isValidId(id)) {
                throw new BadRequestError();
            }

            let user = await this.userRepo.getById(id);

            if(Object.keys(user).length === 0) {
                throw new ResourceNotFoundError();
            }

            return this.removePassword(user);


    }

    async getUserByUniqueKey(queryObj: any): Promise<User> {

                let queryKeys = Object.keys(queryObj);

                if(!queryKeys.every(key => isPropertyOf(key, User))) {
                    throw new BadRequestError();
                }

                // we will only support single param searches (for now)
                let key = queryKeys[0];
                let val = queryObj[key];

                // if they are searching for a user by id, reuse the logic we already have
                if (key === 'id') {
                    throw await this.getUserById(+val);
                }

                // ensure that the provided key value is valid
                if(!isValidStrings(val)) {
                    throw new BadRequestError();
                }

                let user = await this.userRepo.getUserByUniqueKey(key, val);
                if (isEmptyObject(user)) {
                    throw new ResourceNotFoundError();
                }

                return this.removePassword(user);


    }

    async authenticateUser(un: string, pw: string): Promise<User> {


            if (!isValidStrings(un, pw)) {
                throw new BadRequestError();
            }

            let authUser: User;
            
            try {
                authUser = await this.userRepo.getUserByCredentials(un, pw);
            } catch (e) {
                throw e;
            }

            if (Object.keys(authUser).length === 0) {
                throw new AuthenticationError('Bad credentials provided.');
            }

            return this.removePassword(authUser);


    }

    async addNewUser(newUser: User): Promise<User> {
        
            if (!isValidObject(newUser, 'id')) {
                throw new BadRequestError('Invalid property values found in provided user.');
            }

            let usernameAvailable = await this.isUsernameAvailable(newUser.username);
            
            if (!usernameAvailable) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }

            let accountnameAvailable = await this.isAccountAvailable(newUser.account_name);

            if(!accountnameAvailable) {
                throw new ResourcePersistenceError('The provided account name is already taken.');
            }

                const persistedUser = await this.userRepo.save(newUser);
                return this.removePassword(persistedUser);
            

    }

    updateUser(updatedUser: User): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {

            if (!isValidObject(updatedUser)) {
                reject(new BadRequestError('Invalid user provided (invalid values found).'));
                return;
            }

            try {
                // let repo handle some of the other checking since we are still mocking db
                resolve(await this.userRepo.update(updatedUser));
            } catch (e) {
                reject(e);
            }

        });

    }

    deleteById(id: number): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {
            reject(new NotImplementedError());
        });

    }

    private async isUsernameAvailable(username: string): Promise<boolean> {

        try {
            await this.getUserByUniqueKey({'username': username});
        } catch (e) {
            console.log('username is available');
            return true;
        }

        console.log('username is unavailable');
        return false;

    }

    private async isAccountAvailable(acname: string): Promise<boolean> {

        try {
            await this.getUserByUniqueKey({'account_name': acname});
        } catch (e) {
            console.log('Account name is available');
            return true;
        }

        console.log('Account name is unavailable');
        return false;

    }

    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        let usr = {...user};
        delete usr.password;
        return usr;   
    }

}