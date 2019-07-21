const { log } = require('console');
const { sequelize } = require('../sequelize');
const { name, version } = require('../../package.json');

const { SQL_SYNC } = process.env;

/** @module sequelize-connector */
exports.plugin = {
    name: `${name}:route:sequelize`,
    version,
};

/**
 * @async
 * @function sequelize-connector/register
 * @param {object} server
 */
exports.plugin.register = async(server, options) => {
    try {
        await sequelize.authenticate();
        if ((SQL_SYNC)) {
            sequelize.sync();
            log('Sincronización realizada con éxito!');
        }
    } catch (ex) {
        log('error connecting with database', ex);
    }
};