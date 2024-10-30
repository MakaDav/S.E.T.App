const mysql = require('mysql');
const connectionDetails = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sis_api_alpha'
}

function getDBConnection(connectionDetails) {
    const connection = mysql.createConnection({
        host: connectionDetails.host,
        user: connectionDetails.user,
        password: connectionDetails.password,
        database: connectionDetails.database,
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            throw err;
        }
        console.log('Connected to the MySQL database');
    });

    return connection;
}

module.exports = {
    dbConnection:getDBConnection(connectionDetails)
}

