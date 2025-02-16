const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'lab5-do-user-18970628-0.d.db.ondigitalocean.com',
    user: 'doadmin',
    password: 'AVNS_snUocoJVRDAnpInn_GM',
    database: 'lab5',
    multipleStatements: false,
    port: 25060,
    ssq:{
        rejectUnauthorized: true
    }
});

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

