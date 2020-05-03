
import { Stat } from "../models/stat";
import { StatRepository } from "../repos/stat-repo";
import { ResourceNotFoundError, BadRequestError } from "../errors/errors";
import { isValidStrings, isEmptyObject, isPropertyOf } from "../util/validator";
import { User } from "../models/user";

export class StatService {

    constructor(private statRepo: StatRepository) {
        this.statRepo = statRepo;
    }

    async getAllStats(): Promise<Stat[]> {

        let stats = await this.statRepo.getAll();

        if (stats.length == 0) {
            throw new ResourceNotFoundError('Table is empty.');
        }



        return stats; 
    }

    async getStatByUniqueKey(queryObj: any): Promise<User> {

        let queryKeys = Object.keys(queryObj);

        if (!queryKeys.every(key => isPropertyOf(key, User))) {
            throw new BadRequestError();
        }

        // we will only support single param searches (for now)
        let key = queryKeys[0];
        let val = queryObj[key];

        // ensure that the provided key value is valid
        if (!isValidStrings(val)) {
            throw new BadRequestError();
        }

        let char = await this.statRepo.getStatByUniqueKey(key, val);
        
        if (isEmptyObject(char)) {
            throw new ResourceNotFoundError();
        }

        return char;


    }

    async addStats(allEntries: any, acname: string) {

        let rankCounter:number = 0;
        let levelCounter: number = 0;
        let counter: number = 0 ;
        let avgRank: number = 0
        let avgLevel: number = 0;

        let owner = await this.getStatByUniqueKey({'account_name': acname });

        for(let newEntry of allEntries){
            counter ++;
            rankCounter = newEntry.rank + rankCounter;
            levelCounter = newEntry.character.level + levelCounter;
        }
        avgRank = rankCounter / counter;
        avgLevel = levelCounter / counter;

        let persisted = await this.statRepo.save(owner, avgRank, avgLevel);
        
        return persisted;

    }
}