const connection = require('./db_config');

connection.query("SELECT 1", (err, result) => {
    if (err) {
        console.error("Database Connection Failed:", err);
    } else {
        console.log("Database Connection Successful:", result);
    }
    connection.end();
});
