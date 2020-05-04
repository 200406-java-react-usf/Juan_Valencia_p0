import { Character } from '../models/character';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapCharacterResultSet } from '../util/result-set-mapper';
import { InternalServerError } from '../errors/errors';

export class CharRepository implements CrudRepository<Character> {

    private baseQuery = `
    select
        c.char_id,
        c.char_name, 
        c.league_name, 
        c.ranking,
        c.char_level,
        au.account_name as account_name
    from characters c
    join app_users au
    on c.user_id = au.user_id
    `;

    async getAll(): Promise<Character[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapCharacterResultSet);
        } catch (e) {
            throw new InternalServerError(e);
        } finally {
            client && client.release();
        }
    }

    async getById(id: number): Promise<Character[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.user_id = $1 ;`;
            let rs = await client.query(sql, [id]);
            return rs.rows.map(mapCharacterResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getCharByUniqueKey(key: string, val: string): Promise<Character> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where au.${key} = $1 ;`;
            let rs = await client.query(sql, [val]);
            return mapCharacterResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async save(newChar: Character): Promise<Character> {
        
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = `insert into characters (user_id, char_name, league_name, ranking, char_level) 
                    values ( ( select user_id from app_users where account_name = $1 ) , 
                    $2 , $3 , $4 , $5 ) ;`;
            let rs = await client.query(sql, [newChar.accountName , newChar.charName , newChar.leagueName, newChar.rank, newChar.charLevel]);
            return mapCharacterResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError(e);
        } finally {
            client && client.release();
        }
    }

    async update(updatedChar: Character): Promise<boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'update characters set ranking = $1 , char_level = $2 where char_id = $3 ;';
            await client.query(sql, [ updatedChar.rank, updatedChar.charLevel, updatedChar.charId ]);
            return true;
        } catch (e) {
            throw new InternalServerError(e);
        } finally {
            client && client.release();
        }
    }

    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'delete from characters where user_id = $1 ';
            await client.query(sql, [id]);
            return true;
        } catch (e) {
            throw new InternalServerError(e);
        } finally {
            client && client.release();
        }
    }

    
}