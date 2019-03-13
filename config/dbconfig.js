/**
 * Created by nonde_xx on 2019-03-06.
 */
const mysql = require('mysql')

const connectdb=()=>{
    let connection = mysql.createConnection({
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : '123456',
        database : 'test'
    })
    return connection;
}

module.exports=connectdb;

