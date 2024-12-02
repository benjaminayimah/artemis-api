'use strict';
const bcrypt = require('bcryptjs');
const { getRandomColor } = require('../utils/ColorTrait')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'JohnDoe1234',
        email: 'johndoe@example.com',
        password: await bcrypt.hash('123456#@!', 10),
        picture: null,
        color: getRandomColor(),
        googleId: null,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
