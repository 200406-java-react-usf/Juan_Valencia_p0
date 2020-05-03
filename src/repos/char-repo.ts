import { Character } from '../models/character';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';
import { InternalServerError } from '../errors/errors';

export class CharRepository implements CrudRepository<Character> {

    private baseQuery = `
    select
        c.char_id,
        c.user_id, 
        c.char_name, 
        c.league_name, 
        c.ranking,
        c.char_level
    from characters c
    `;

    async getAll(): Promise<Character[]> {
        return 
    }

    async getById(id: number): Promise<Character> {
        return
    }

    async getCharByUniqueKey(key: string, val: string): Promise<Character> {
        return
    }

    async save(newUser: Character): Promise<Character> {
        return
    }

    async update(updatedUser: Character): Promise<boolean> {
        return
    }

    async deleteById(id: number): Promise<boolean> {
        return
    }
}