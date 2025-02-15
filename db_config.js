const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'lab5',
    multipleStatements: false,
})
console.log("Connecting to database:", connection);

connection.connect(function(err){
    if(err){
        console.log('Error connecting to database');
        throw err;
    } 
    else console.log('Connected to database');
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS patient (
        patientid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATETIME NOT NULL
    ) ENGINE = InnoDB;
`

connection.query(createTableQuery, (err, result) => {
    if(err){
        console.log('Error creating table: ', err);
    } else {
        console.log('Table created successfully');
    }
})
module.exports = connection;