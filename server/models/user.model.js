const Constants = require("../config/constants")
const bookshelf = require("../config/bookshelf")

const User = bookshelf.model('User', {
    tableName: Constants.USERS_TABLE,
})

module.exports = User;