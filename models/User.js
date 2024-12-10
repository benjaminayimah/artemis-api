// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Agent = require('./Agent')
const Favourite = require('./Favourite')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            isIn: [[true, false]]
        }
    },
    hasUpgraded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            isIn: [[true, false]]
        }
    }

}, {
    timestamps: true,
    tableName: 'users',
});

// Relationship
User.hasMany(Agent, { as: 'agents', foreignKey: 'userId' });
Agent.belongsTo(User, { as: 'user',  foreignKey: 'userId' });


User.hasMany(Favourite, { foreignKey: 'userId', as: 'favourites' });
Favourite.belongsTo(User, { foreignKey: 'userId', as: 'user' });


module.exports = User;
