import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';
import { InternalServerError } from '../errors/errors';


export class UserRepository implements CrudRepository<User> {

    private baseQuery = `
    select
        au.user_id, 
        au.username, 
        au.password, 
        au.account_name
    from app_users au 
    `;

    async getAll(): Promise<User[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapUserResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async getById(id: number): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.user_id = $1 ;`;
            let rs = await client.query(sql, [id]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }


    }

    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where au.${key} = $1 ;`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }


    }

    async getUserByCredentials(un: string, pw: string) {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.username = $1 and au.password = $2 ;`;
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async save(newUser: User): Promise<User> {

        let client: PoolClient;

        // console.log('at persisting')
        //     let sql = `insert into app_users (username, password, first_name, last_name, email, role_id) values ( $1 , $2 , $3 , $4 , $5 , 3)`;
        //     let rs = await client.query(sql, [newUser.username ,newUser.password ,newUser.firstName ,newUser.lastName ,newUser.email]);
        //     return mapUserResultSet(rs.rows[0]);

        try {
            client = await connectionPool.connect();
            let sql = `insert into app_users (username, password, account_name) values ( $1 , $2 , $3 ) ;`;
            let rs = await client.query(sql, [newUser.username ,newUser.password , newUser.account_name]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async update(updatedUser: User): Promise<boolean> {
        console.log(`password : ${updatedUser.password} and account : ${updatedUser.account_name} and  user : ${updatedUser.username}`)
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `update app_users set password = $1 , account_name = $2 where username = $3 ;`;
            let rs = await client.query(sql, [ updatedUser.password, updatedUser.account_name, updatedUser.username ]);
            return true;
        } catch (e) {
            throw new InternalServerError(e);
        } finally {
            client && client.release();
        }

    }

    async deleteById(id: number): Promise<boolean> {
        console.log(id);
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from app_users where user_id = $1 `;
            let rs = await client.query(sql, [id]);
            return true;
        } catch (e) {
            throw new InternalServerError(e);
        } finally {
            client && client.release();
        }
    }
}