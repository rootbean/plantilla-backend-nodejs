const { Op } = require('sequelize');
const { User } = require('../../../sequelize');

/**
 * @description buscar todos los usuarios
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.findAll = async() => {
    try {
        const exclude = { attributes: { exclude: ['password'] } };
        return await User.findAll(exclude);
    } catch (ex) {
        throw ex;
    }
};

/**
 * @description buscar usuario por id
 * @param id
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.findById = async(id) => {
    try {
        const query = { where: { id }, attributes: { exclude: ['password'] } };
        return await User.findOne(query);
    } catch (ex) {
        throw ex;
    }
};

/**
 * @description guardar usuario
 * @param payload
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.save = async(payload) => {
    try {
        const model = {...payload };
        const result = await User.create(model);
        if (result && result.dataValues) {
            delete result.dataValues.password;
        }
        return result.dataValues;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @description actualizar usuario
 * @param _id
 * @param payload
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.update = async(id, payload) => {
    try {
        const model = {...payload };
        if (model.id) {
            delete model.id;
        }
        if (model.password) {
            delete model.password;
        }
        if (model.rol) {
            delete model.rol;
        }
        const result = await User.findOne({ where: { id } });
        const resultUpdate = await result.update(model);
        return resultUpdate;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @description buscar usuario por email
 * @param email
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.findByEmail = async(email) => {
    try {
        const query = { where: { email }, attributes: { exclude: ['password'] } };
        return await User.findOne(query);
    } catch (ex) {
        throw ex;
    }
};

/**
 * @description authenticar usuario
 * @param email
 * @param password
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.login = async(email, password) => {
    try {
        const query = {
            where: { email, password },
            attributes: { exclude: ['password'] }
        };
        return await User.findOne(query);
    } catch (ex) {
        throw ex;
    }
};

/**
 * @description inactivar usuario
 * @param id
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.disabled = async(id) => {
    try {
        const result = await User.findOne({ where: { id } });
        const resultUpdate = await result.update({ active: false });
        return resultUpdate;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @description activar usuario
 * @param id
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.actived = async(id) => {
    try {
        const result = await User.findOne({ where: { id } });
        const resultUpdate = await result.update({ active: true });
        return resultUpdate;
    } catch (ex) {
        throw ex;
    }
};

/**
 * @description consulta de usuarios con paginación
 * @param pag
 * @param cantByPage
 * @param whereQuery
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.paginate = async(pag, cantByPage, whereQuery = {}) => {
    try {

        const page = Number(pag) || 1;
        const qtyPerPage = Number(cantByPage) || 10;

        const skip = qtyPerPage * (page - 1);
        const query = {
            order: [
                ['createdAt', 'DESC']
            ],
            offset: skip,
            limit: qtyPerPage,
            where: {...whereQuery },
            attributes: { exclude: ['password'] },
        };

        const resultData = await User.findAll(query);

        const count = await User.count({ where: query.where });
        const pages = Math.ceil(count / qtyPerPage);
        const result = {
            meta: {
                paging: {
                    page,
                    limit: qtyPerPage,
                    totalPages: pages,
                    count
                },
            },
            data: resultData,
        };
        return result;
    } catch (ex) {
        throw ex;
    }
};