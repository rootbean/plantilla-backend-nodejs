const Joi = require('@hapi/joi');

const jwtExp = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

exports.idModel = Joi.number().required().description('id')
    .example(1);

exports.headersPayload = Joi.object()
    .keys({
        authorization: Joi.string().regex(jwtExp).required().description('token user'),
    }).unknown();