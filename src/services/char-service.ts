import { Character } from '../models/character';
import { CharRepository } from '../repos/char-repo';
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from '../util/validator';
import { BadRequestError, ResourceNotFoundError } from '../errors/errors';

export class CharService {

    constructor(private charRepo: CharRepository) {
        this.charRepo = charRepo;
    }
    /**
     * Returns a Promise of type Character[] will throw ResourceNotFoundError if Table is Empty
     */
    async getAllChars(): Promise<Character[]> {

        let chars = await this.charRepo.getAll();

        if (chars.length == 0) {
            throw new ResourceNotFoundError('Table is empty.');
        }

        return chars; 
    }

    /**
     *  Returns a Promise of type Character[]
     * @param id - number that belongs to the user id.
     */
    async getCharById(id: number): Promise<Character[]> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let chars = await this.charRepo.getById(id);

        if (Object.keys(chars).length === 0) {
            throw new ResourceNotFoundError();
        }

        return chars;
    }

    async getCharByUniqueKey(queryObj: any): Promise<Character> {

        let queryKeys = Object.keys(queryObj);

        if (!queryKeys.every(key => isPropertyOf(key, Character))) {
            throw new BadRequestError();
        }


        let key = queryKeys[0];
        let val = queryObj[key];


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
        let newchar;


        await this.getCharByUniqueKey({ 'accountName': acname });

        for (let newEntry of allEntries) {
            convertion = new Character(1, newEntry.character.name, lname, newEntry.rank, newEntry.character.level, acname);

            newchar = await this.charRepo.save(convertion);

        }

        return newchar;
    }

    async updateChar(updatedChar: Character): Promise<boolean> {

        if (!isValidObject(updatedChar)) {
            throw new BadRequestError('Invalid character provided (invalid values found).');

        }

        let queryKeys = Object.keys(updatedChar);

        if (!queryKeys.every(key => isPropertyOf(key, Character))) {
            throw new BadRequestError();
        }

        return await this.charRepo.update(updatedChar);


    }

    async deleteById(charUserId: number): Promise<boolean> {

        if (!isValidId(charUserId)) {
            throw new BadRequestError();
        }

        let isDeleted = await this.charRepo.deleteById(charUserId);

        return isDeleted;
    }

    
}
