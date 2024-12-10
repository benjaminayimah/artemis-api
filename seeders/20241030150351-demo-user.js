'use strict';
const bcrypt = require('bcryptjs');
const { getRandomColor } = require('../utils/UserTrait')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'JohnDoe1234',
        displayName: 'John Doe',
        email: 'johndoe@example.com',
        password: await bcrypt.hash('123456#@!', 10),
        image: null,
        color: getRandomColor(),
        googleId: null,
        verified: true,
        hasUpgraded: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
