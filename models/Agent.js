// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Favourite = require('./Favourite');
const User = require('./User');


const Agent = sequelize.define('Agent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    chatId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    agentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    headline: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    greeting: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    instructions: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    visibility: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    }
    
}, {
    timestamps: true,
    tableName: 'agents',
});

Agent.hasMany(Favourite, { foreignKey: 'agentId', as: 'favourites' });
Favourite.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' });



module.exports = Agent;
