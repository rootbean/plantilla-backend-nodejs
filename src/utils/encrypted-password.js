const crypto = require('crypto-js');

const { SECRET_PASSWORD } = process.env;

exports.encryptedPass = (pass) => {
    try {
        const passStringify = JSON.stringify(pass);
        const result = crypto.SHA512(passStringify, SECRET_PASSWORD).toString(crypto.enc.Hex);
        return result;
    } catch (err) {
        throw err;
    }
};