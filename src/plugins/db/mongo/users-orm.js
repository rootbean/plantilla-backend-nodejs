const DataModel = require('../../../models/mongo/users');

/**
 * @description buscar todos los usuarios
 * @version 1.0
 * @author Ruber Rodríguez V
 */
exports.findAll = async() => {
    try {
        return await DataModel.find();
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
        return await DataModel.findOne({ _id: id }).exec();
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
    const model = {...payload };

    try {
        const Data = new DataModel(model);
        return await Data.save();
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
        return await DataModel.updateOne({ _id: id }, payload);
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
        return await DataModel.findOne({ email }).exec();
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
        return await DataModel.findOne({ email, password }).exec();
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
        return await DataModel.updateOne({ _id: id }, { active: false });
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
        return await DataModel.updateOne({ _id: id }, { active: true });
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
        const query = data;
        const page = Number(pag);
        const qtyPerPage = Number(cantByPage);
        const skip = qtyPerPage * (page - 1);
        const resultData = await DataModel.find(whereQuery).skip(skip).limit(qtyPerPage).exec();
        const count = await DataModel.count(whereQuery).exec();
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
    } catch (err) {
        error(`there is an error mongodb@usersPaginate: ${err.message}`);
        throw err;
    }
};