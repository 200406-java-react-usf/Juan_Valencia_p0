import { Character } from "../models/character";
import { CharRepository } from "../repos/char-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { BadRequestError, ResourceNotFoundError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";

export class CharService {

    constructor(private charRepo: CharRepository) {
        this.charRepo = charRepo;
    }

    async getAllChars(): Promise<Character[]> {
        return 
    }

    async getCharsById(id: number): Promise<Character> {
        return
    }

    async getCharByUniqueKey(key: string, val: string): Promise<Character> {
        return
    }

    async addNewChar(newUser: Character): Promise<Character> {
        return
    }

    async updateChar(updatedUser: Character): Promise<boolean> {
        return
    }

    async deleteById(id: number): Promise<boolean> {
        return
    }
}
