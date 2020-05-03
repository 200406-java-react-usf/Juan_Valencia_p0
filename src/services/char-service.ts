import { Character } from "../models/character";
import { CharRepository } from "../repos/char-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { BadRequestError, ResourceNotFoundError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";

export class CharService {

    constructor(private charRepo: CharRepository) {
        this.charRepo = charRepo;
    }

    async getAllChars(): Promise<Character[]> {

        let chars = await this.charRepo.getAll();

        if (chars.length == 0) {
            throw new ResourceNotFoundError();
        }

        return chars; 
    }

    async getCharById(id: number): Promise<Character> {
        return
    }

    async getCharByUniqueKey(queryObj: any): Promise<Character> {

        let queryKeys = Object.keys(queryObj);

        if (!queryKeys.every(key => isPropertyOf(key, Character))) {
            throw new BadRequestError();
        }

        // we will only support single param searches (for now)
        let key = queryKeys[0];
        let val = queryObj[key];

        // if they are searching for a user by id, reuse the logic we already have
        if (key === 'id') {
            throw await this.getCharById(+val);
        }

        // ensure that the provided key value is valid
        if (!isValidStrings(val)) {
            throw new BadRequestError();
        }

        let char = await this.charRepo.getCharByUniqueKey(key, val);
        if (isEmptyObject(char)) {
            throw new ResourceNotFoundError();
        }

        return char;


    }

    async addNewChar(allEntries: any, acname: string, lname: string): Promise<Character> {
        let convertion;
        

        for(let newEntry of allEntries){
            try{
            convertion = new Character(1,  newEntry.character.name, lname, newEntry.rank, newEntry.character.level,acname);
            console.log(convertion);

            const persistedChar = await this.charRepo.save( convertion );
            }
            catch (e) {
                throw e;
            }
        }   
        return convertion;
    }

    async updateChar(updatedChar: Character): Promise<boolean> {
        try {

            if (!isValidObject(updatedChar)) {
                throw new BadRequestError('Invalid character provided (invalid values found).');

            }

            let queryKeys = Object.keys(updatedChar);

            if (!queryKeys.every(key => isPropertyOf(key, Character))) {
                throw new BadRequestError();
            }

            console.log(updatedChar)
            return await this.charRepo.update(updatedChar);

        } catch (e) {
            throw e;
        }
    }

    async deleteById(charUserId: number): Promise<boolean> {

        if (!isValidId(charUserId)) {
            throw new BadRequestError();
        }

        // let char = await this.getCharByUniqueKey({'user_id': userId})

        // if (isEmptyObject(char)) {
        //     throw new ResourceNotFoundError();
        // }
        let isDeleted = await this.charRepo.deleteById(charUserId);

        return isDeleted;
    }


}
