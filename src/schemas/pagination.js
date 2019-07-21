const Joi = require('@hapi/joi');

exports.pagintationValidate = Joi.object()
    .keys({
        page: Joi.number().optional().description('page')
            .example(1)
            .default(1),
        qtyPerPage: Joi.number().max(40).optional().description('quantity by page')
            .example(10)
            .default(10),
    }).unknown();