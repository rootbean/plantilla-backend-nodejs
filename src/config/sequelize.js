const fs = require('fs');

const {
    SQL_DB,
    SQL_USERNAME,
    SQL_PASSWORD,
    SQL_HOST,
    SQL_PORT,
    SQL_DIALECT,
    SQL_SSL,
} = process.env;

module.exports = {
    database: SQL_DB,
    username: SQL_USERNAME,
    password: SQL_PASSWORD,
    options: {
        port: SQL_PORT || 5432,
        host: SQL_HOST || 'localhost',
        dialect: SQL_DIALECT || 'postgres',
        logging: false,
        storage: 'dist.postgres',
        timezone: 'America/Bogota'
    },
};