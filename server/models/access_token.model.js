const Constants = require('../config/constants');
const bookshelf = require('../config/bookshelf');

const AccessToken = bookshelf.model('AccessToken', {
    tableName: Constants.ACCESS_TOKEN,
});

module.exports = AccessToken;