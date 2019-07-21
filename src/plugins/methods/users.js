const { name, version } = require('../../../package.json');

// const dataOrm = require('../db/mongo/users-orm'); Habilitar cuando se trabaje con mongo

const dataOrm = require('../db/sql/users-orm');

exports.plugin = {
    name: `${name}:methods:users`,
    version,
};

exports.plugin.register = async(server) => {

    server.method('getUsers', async() => {
        try {
            return await dataOrm.findAll();
        } catch (ex) {
            throw ex;
        }
    });

    server.method('getUserById', async(id) => {
        try {
            return await dataOrm.findById(id);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('saveUser', async(payload) => {
        try {
            return await dataOrm.save(payload);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('updateUser', async(id, payload) => {
        try {
            return await dataOrm.update(id, payload);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('getUserByEmail', async(email) => {
        try {
            return await dataOrm.findByEmail(email);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('loginUser', async(email, password) => {
        try {
            return await dataOrm.login(email, password);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('disabledUser', async(id) => {
        try {
            return await dataOrm.disabled(id);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('activeUser', async(id) => {
        try {
            return await dataOrm.actived(id);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('paginateUser', async(pag, cantByPage, whereQuery) => {
        try {
            return await dataOrm.paginate(pag, cantByPage, whereQuery);
        } catch (ex) {
            throw ex;
        }
    });

};