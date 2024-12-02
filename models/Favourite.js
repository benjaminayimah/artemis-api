const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = require('./User');
const Agent = require('./Agent');


const Favourite = sequelize.define('Favourite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'favourites',
});



module.exports = Favourite;
