const base64url = require('base64url');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { forbidden } = require('@hapi/boom');

const { JWT_EXPIRATION_SECONDS, IS_SQL } = process.env;

const jwtExpirationSeconds = parseInt(JWT_EXPIRATION_SECONDS) || 3600;
const { log, error } = console;

exports.createToken = async(user, privateKey, algorithm) => {
    try {

        // const { _id: id, email, rol } = user; Habilitar si es mongo 
        const { id, email, rol } = user; // Deshabilitar si es mongo
        const payload = {
            id,
            rol,
            e: base64url.encode(email),
            iat: moment().unix(),
            exp: moment().add(jwtExpirationSeconds, 'seconds').unix(),
        };
        const result = await jwt.sign(payload, privateKey, { algorithm });
        return result;
    } catch (err) {
        error(`error plugins/auth/local@createToken: ${err}`);
        throw err;
    }
};

exports.decodeToken = async(token, publicKey, ignoreExpiration, algorithm) => {
    try {
        const payload = await jwt.verify(token, publicKey, {
            algorithms: [algorithm],
            ignoreExpiration
        });

        if (payload.exp <= moment().unix()) {
            const err = { statusCode: 401, message: 'El token ha expirado!' };
            error(err);
            throw err;
        }
        return payload;
    } catch (e) {
        const err = { status: 500, message: 'Token invalido!' };
        error(`error plugins/auth/local@decodeToken: ${err}`);
        throw err;
    }
};

exports.validateRol = async(dataCredential, rolRequired) => {
    try {
        log(`${Date.now()} log plugins/auth/local@validateRol`);
        const rolCredential = dataCredential.rol;
        const result = rolRequired.includes(rolCredential);
        if (!result) {
            return forbidden('No tiene suficientes permisos!');
        }
        return result;
    } catch (ex) {
        throw ex;
    }
};