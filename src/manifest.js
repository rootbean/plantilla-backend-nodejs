const fs = require('fs');
const path = require('path');

// Configuración del servidor
const { applyToDefaults } = require('@hapi/hoek');
const { parsed } = require('dotenv').config();
const { name, version, description } = require('../package.json');
// Dejar si se va a trabajar con MongoDB
// const { dbOptionsMongo } = require('./config/mongo');

const publicKey = fs.readFileSync(`${process.cwd()}/ssl/jwt-key.crt`, 'utf8');

exports.glueOptions = async() => ({
    relativeTo: path.join(__dirname, '/'),
});

exports.configure = async(config = {}) => {
    applyToDefaults(process.env, applyToDefaults(parsed || {}, config));
};

exports.loadServer = async() => ({
    port: process.env.PORT,
    host: process.env.HOST,
    address: process.env.ADDRESS,
    app: {
        globals: process.env,
    },
    debug: {
        log: process.env.NODE_ENV === 'production' ? 'info' : '*',
        request: process.env.NODE_ENV === 'production' ? ['error'] : '*',
    },
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control'],
        },
    },
});

exports.loadPlugins = async() => ({
    plugins: [{
            plugin: '@hapi/inert',
        },
        {
            plugin: '@hapi/vision',
        },
        {
            plugin: 'hapi-swagger',
            routes: {
                prefix: `/api/${process.env.API_VERSION}`,
            },
            options: {
                host: process.env.HOST_SWAGGER,
                info: {
                    title: `${name}: API documentation. ${description}`,
                    version,
                },
            },
        },
        {
            plugin: 'blipp',
        },
        {
            plugin: 'hapi-alive',
            routes: {
                prefix: `/api/${process.env.API_VERSION}`,
            },
            options: {
                path: '/health',
                tags: ['api', 'health', 'monitor'],
            },
        },
        /*
        {
            plugin: './plugins/jmc',
            options: {
                db: dbOptionsMongo.db,
                opt: dbOptionsMongo.opt,
            },
        },
        */
        {
            plugin: './plugins/sequelize.js',
            options: {
                env: process.env.NODE_ENV,
                sync: process.env.SQL_SYNC || false,
            },
        },
        {
            plugin: './plugins/jwt',
        },
        {
            plugin: './plugins/methods/jwt',
        },
        {
            plugin: './plugins/methods/users',
        },
        {
            plugin: './plugins/routes/users',
            routes: {
                prefix: `/api/${process.env.API_VERSION}`,
            },
        },
    ],
});