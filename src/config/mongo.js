const { MONGO_DB_URL } = process.env;

exports.dbOptionsMongo = {
    db: MONGO_DB_URL,
    opt: {
        useNewUrlParser: true,
        useCreateIndex: true,
    },
};