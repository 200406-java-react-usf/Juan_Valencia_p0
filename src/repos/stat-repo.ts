import { Stat } from "../models/stat";
import { PoolClient } from "pg";
import { connectionPool } from "..";
import { mapStatResultSet, mapUserResultSet } from "../util/result-set-mapper";
import { InternalServerError } from "../errors/errors";
import { User } from "../models/user";

export class StatRepository {

    private baseQuery = `
    select
        s.stat_id,
        s.avg_rank,
        s.avg_char_level,
        s.improved,
        s.created_on,
        au.account_name as account_name
        from stats s
        join app_users au
        on s.user_id = au.user_id
    `;

    async getAll(): Promise<Stat[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); 
            return rs.rows.map(mapStatResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async getStatByUniqueKey(key: string, val: string): Promise<User> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `select * from app_users au where au.${key} = $1 ;`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getById(id: number): Promise<Stat> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.user_id = $1 ;`;
            let rs = await client.query(sql, [id]);
            return mapStatResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async save(newStat: User, avgRank: number, avgLevel: number): Promise<Stat> {
        
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = `insert into stats (user_id, avg_rank, avg_char_level) 
                values ( $1 , $2 , $3 ) ;`;
            let rs = await client.query(sql, [newStat.id , +avgRank , +avgLevel]);
            return mapStatResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError(e);
        } finally {
            client && client.release();
        }
    }
}