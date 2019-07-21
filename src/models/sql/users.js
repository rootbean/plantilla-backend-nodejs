module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING('30'),
        email: {
            type: DataTypes.STRING(60),
            unique: {
                msg: 'ya se encuentra registrado!.',
            },
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        rol: {
            type: DataTypes.ENUM,
            values: ['admin', 'guest'],
            defaultValue: 'guest',
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    /*
    User.associate = (models) => {
        // ManyToOne
        User.hasMany(models.Students, {
            as: 'brands',
            foreignKey: {
                field: 'idUser',
                name: 'idUser',
                allowNull: false,
            },
        });

        // OneToMany
        User.belongsTo(models.City, {
            foreignKey: {
                field: 'idCity',
                name: 'idCity',
                allowNull: false,
            },
        });
    };
    */
    return User;
};