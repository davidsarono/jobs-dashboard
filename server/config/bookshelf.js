const bookshelf = require('bookshelf');
const database = require('./database');

const knex = require('knex')(database);

module.exports = bookshelf(knex);
