import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createConnection = async (config) => {
    try {
        return await mysql.createConnection(config);
    } catch (err) {
        throw err;
    }
};

// Default database connection
const mainDB = async () => {
    return createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        connectionLimit: 10,
    });
};

export { mainDB};
