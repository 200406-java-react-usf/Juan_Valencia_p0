const {Pool, Client} = require('pg')
const connectionString = 'postgresssql://postgres:Pathofexile1.@localhost:5432/test';
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "test",
    password: "Pathofexile1.",
    port: 5432
})

pool.query("CREATE TABLE Test(id INT, ign VARCHAR(10), username VARCHAR(10), password VARCHAR(10))"),(err, res)=> {
    console.log(err,res);
    pool.end();
}
// const client = new Client({
//     connectionString:connectionString
// })

// client.connect()

// client.query("CREATE TABLE Test(id INT, ign VARCHAR(10), username VARCHAR(10), password VARCHAR(10)"),(err, res)=> {
//         console.log(err,res);
//         client.end();
//     }