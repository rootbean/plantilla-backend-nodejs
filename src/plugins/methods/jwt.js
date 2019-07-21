const { name, version } = require('../../../package.json');
const moment = require('moment');

const { createTokenRecoveryPassword } = require('../auth/recovery-password');
const { createToken, decodeToken, validateRol } = require('../auth/local');
const { error, log } = console;
/**
 * @module jwt-manager-plugin
 */
exports.plugin = {
    name: `${name}:methods:auth`,
    version,
};

/**
 * @async
 * @function jwt-manager-plugin/register
 * @param {object} server
 * @param {object} options
 */
exports.plugin.register = async(server) => {

    server.method('jwtCreateTokenAuth', async(user, privateKey, algorithm) => {
        try {
            return await createToken(user, privateKey, algorithm);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('jwtDecodeToken', async(token, publicKey, ignoreExpiration, algorithm) => {
        try {
            return await decodeToken(token, publicKey, ignoreExpiration, algorithm);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('jwtValidateRol', async(dataCredential, rolRequired) => {
        try {
            return await validateRol(dataCredential, rolRequired);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('jwtCreateTokenRecoveryPassword', async(email, privateKey, algorithm) => {
        try {
            return await createTokenRecoveryPassword(email, privateKey, algorithm);
        } catch (ex) {
            throw ex;
        }
    });


};