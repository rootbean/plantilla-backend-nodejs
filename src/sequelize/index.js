const Sequelize = require('sequelize');
const {
    database,
    username,
    password,
    options,
} = require('../config/sequelize');

const db = {
    Sequelize,
    sequelize: new Sequelize(database, username, password, options),
};

db.User = db.sequelize.import('../models/sql/users');

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

module.exports = db;