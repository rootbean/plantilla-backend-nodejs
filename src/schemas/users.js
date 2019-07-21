const Joi = require('@hapi/joi');

exports.usersPayload = Joi.object().keys({
    name: Joi.string().required().description('name')
        .example('Ruber'),
    email: Joi.string().email().required().description('email')
        .example('ruber19@gmail.com'),
    password: Joi.string().required().description('password')
        .example('123456'),
});

exports.loginPayload = Joi.object()
    .keys({
        email: Joi.string().email().required().description('email')
            .lowercase({ force: true })
            .example('ruber19@gmail.com'),
        password: Joi.string().required().description('password')
            .example('123456'),
    })
    .unknown();