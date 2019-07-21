const fs = require('fs');
const { conflict, badImplementation } = require('@hapi/boom');

const { name, version } = require('../../../package.json');
const { usersPayload, loginPayload } = require('../../schemas/users');
const { idModel, headersPayload } = require('../../schemas/others');
const { pagintationValidate } = require('../../schemas/pagination');
const { encryptedPass } = require('../../utils/encrypted-password');
const { handleError } = require('../../utils/handle-error');

const privateKey = fs.readFileSync(`${process.cwd()}/ssl/jwt-key.key`, 'utf8');

const { log, error } = console;

exports.plugin = {
    name: `${name}:route:users`,
    version,
};

exports.plugin.register = async(server) => {
    // Crear un usuario
    server.route({
        path: '/users',
        method: 'POST',
        options: {
            description: 'Crear un usuario',
            tags: ['api'],
            auth: false,
            validate: {
                payload: usersPayload,
                failAction: handleError,
            },
            pre: [{
                assign: 'log',
                method: async(request) => {
                    log(request.path, 'at', Date.now());
                    return true;
                },
            }, {
                assign: 'validateUsername',
                method: async(request) => {
                    try {
                        const { payload } = request;
                        const user = await server.methods.getUserByEmail(payload.email);
                        if (user) {
                            return conflict('El email ya existe!.');
                        }
                        return user;
                    } catch (ex) {
                        throw ex;
                    }
                },
            }],
        },
        handler: async(request, h) => {
            try {
                const { payload } = request;
                payload.password = encryptedPass(payload.password);
                const response = await server.methods.saveUser(payload);
                return h.response({ user: response, message: 'El usuario fue creado!' }).code(201);
            } catch (e) {
                error('error al guardar el usuario', e);
                return badImplementation('process failed');
            }
        },
    });

    // find all users
    server.route({
        path: '/users',
        method: 'GET',
        options: {
            description: 'Obtener usuarios',
            tags: ['api'],
            auth: false,
            validate: {
                failAction: handleError,
            },
            pre: [{
                assign: 'log',
                method: async(request) => {
                    log(request.path, 'at', Date.now());
                    return true;
                },
            }],
        },
        handler: async(request, h) => {
            try {
                const response = await server.methods.getUsers();
                return h.response({ users: response, message: 'ok' }).code(200);
            } catch (e) {
                error('error al encontrar usuarios', e);
                return badImplementation('process failed');
            }
        },
    });

    // find by id
    server.route({
        path: '/users/{id}',
        method: 'GET',
        options: {
            description: 'Obtener usuario por id',
            tags: ['api'],
            auth: false,
            validate: {
                params: {
                    id: idModel,
                },
                failAction: handleError,
            },
            pre: [{
                assign: 'log',
                method: async(request) => {
                    log(request.path, 'at', Date.now());
                    return true;
                },
            }],
        },
        handler: async(request, h) => {
            try {
                const { params } = request;
                const response = await server.methods.getUserById(params.id);
                return h.response({ user: response, message: 'Usuario encontrado' }).code(200);
            } catch (e) {
                error('error al encontrar usuarios', e);
                return badImplementation('process failed');
            }
        },
    });

    // disabled user
    server.route({
        path: '/users/{id}/disabled',
        method: 'GET',
        options: {
            description: 'Inactivar usuario por id',
            tags: ['api'],
            auth: false,
            validate: {
                params: {
                    id: idModel,
                },
                failAction: handleError,
            },
            pre: [{
                assign: 'log',
                method: async(request) => {
                    log(request.path, 'at', Date.now());
                    return true;
                },
            }],
        },
        handler: async(request, h) => {
            try {
                const { params } = request;
                const response = await server.methods.disabledUser(params.id);
                return h.response({ message: 'Usuario actualizado!' }).code(200);
            } catch (e) {
                error('error al inactivar usuario', e);
                return badImplementation('process failed');
            }
        },
    });

    // active user
    server.route({
        path: '/users/{id}/active',
        method: 'GET',
        options: {
            description: 'Activar usuario por id',
            tags: ['api'],
            auth: false,
            validate: {
                params: {
                    id: idModel,
                },
                failAction: handleError,
            },
            pre: [{
                assign: 'log',
                method: async(request) => {
                    log(request.path, 'at', Date.now());
                    return true;
                },
            }],
        },
        handler: async(request, h) => {
            try {
                const { params } = request;
                const response = await server.methods.activeUser(params.id);
                return h.response({ message: 'Usuario actualizado!' }).code(200);
            } catch (e) {
                error('error al activar usuario', e);
                return badImplementation('process failed');
            }
        },
    });

    // Get Users with pagination
    server.route({
        path: '/users/pagination',
        method: 'GET',
        options: {
            description: 'Obtener usuarios con paginación',
            notes: 'Get Users with pagination',
            tags: ['api'],
            auth: false,
            validate: {
                // headers: headersPayload,
                query: pagintationValidate,
                failAction: handleError,
            },
            pre: [{
                assign: 'log',
                method: async(request) => {
                    log(request.path, 'at', Date.now());
                    return true;
                },
            }],
        },
        handler: async(request, h) => {
            try {
                const { query } = request;

                const response = await server.methods
                    .paginateUser(query.page, query.qtyPerPage);
                const found = response && response.data && response.data.length > 0;
                return h.response({ response, found }).code(200);
            } catch (e) {
                error('Error Getting user', e);
                return badImplementation('process failed');
            }
        },
    });

    // Login User
    server.route({
        path: '/users/auth',
        method: 'POST',
        options: {
            auth: false,
            description: 'login user',
            notes: 'login user',
            tags: ['api'],
            validate: {
                payload: loginPayload,
                failAction: handleError,
            },
            pre: [{
                assign: 'log',
                method: async(request) => {
                    log(request.path, 'at', Date.now());
                    return true;
                },
            }, ],
        },
        handler: async(request, h) => {
            try {
                const { payload } = request;
                payload.password = encryptedPass(payload.password);
                const response = await server.methods.loginUser(payload.email, payload.password);
                if (response) {

                    if (!(response.active)) {
                        return h.response({ message: 'el usuario se encuentra inactivo, por favor comunicarse con el administrador' }).code(400);
                    }

                    const token = await server.methods.jwtCreateTokenAuth(response, privateKey, 'RS256');
                    return h.response({ token, message: 'Bienvenido a Wouzi' }).code(200);
                }
                return h.response({ message: 'login invalido' }).code(400);
            } catch (e) {
                error('Error login user', e);
                return badImplementation('process failed');
            }
        },
    });

};