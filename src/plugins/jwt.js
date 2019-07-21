const fs = require('fs');
const { error, log } = require('console');
const { name, version } = require('../../package.json');
const { decodeToken } = require('../plugins/auth/local');

const publicKey = fs.readFileSync(`${process.cwd()}/ssl/jwt-key.crt`, 'utf8');

// Exposed on server.methods
const validateToken = async token => {

    try {

        const userInfo = await decodeToken(token, publicKey, false, 'RS256');
        if (userInfo) {
            return { isValid: true };
        }
        return { isValid: false };
    } catch (err) {
        error('error validateToken: ', err.message);
        return { isValid: false };
    }

};

const validate = async(dataToken, request) => {
    try {
        const { headers } = request;
        if (headers && headers.authorization) {
            const token = headers.authorization;
            const userInfo = await decodeToken(token, publicKey, false, 'RS256');
            if (userInfo) {
                return { isValid: true };
            }
            return { isValid: false };
        }
        return { isValid: false };
    } catch (ex) {
        throw ex;
    }
};

/** @module jwt-connector */
exports.plugin = {
    name: `${name}:auth:jwt`,
    version,
};

/**
 * @async
 * @function jwt-connector/register
 * @param {object} server
 */
exports.plugin.register = async(server, options) => {
    try {

        server.method('validateToken', validateToken);

        await server.register(require('hapi-auth-jwt2'));

        await server.auth.strategy('jwt', 'jwt', {
            key: options.secret,
            validate,
            verifyOptions: {
                algorithms: ['RS256'],
                ignoreExpiration: false
            },
        });

        await server.auth.default('jwt');
    } catch (ex) {
        log('error plugin jwt', ex);
    }
};