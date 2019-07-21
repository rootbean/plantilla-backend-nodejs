const base64url = require('base64url');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.createTokenRecoveryPassword = async(user, privateKey, algorithm) => {
    try {
        // const { _id: id, name, email } = user; Habilitar si es mongo 
        const { id, name, email } = user; // Deshabilitar si es mongo
        const payload = {
            id,
            name,
            e: base64url.encode(email),
            iat: moment().unix(),
            exp: moment().add(15, 'minutes').unix(),
        };
        return await jwt.sign(payload, privateKey, { algorithm });
    } catch (ex) {
        error(`error plugins/auth/recovery-password@createTokenRecoveryPassword: ${err}`);
        throw err;
    }
};