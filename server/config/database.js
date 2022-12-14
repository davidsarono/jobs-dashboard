require('dotenv').config();

module.exports = {
    client: process.env.DB_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8'
    },
    migrations: {
        tableName: 'migrations',
        directory: process.cwd() + '/server/database/migrations',
    },
    seeds: {
        directory: process.cwd() + '/server/database/seeders',
    },
}