const Sequelize = require('sequelize');
const db = require('../lib/db.js');

const Book = db.define('book', {
  ebookId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
  },
  rights: {
    type: Sequelize.STRING,
  },
  publisher: {
    type: Sequelize.STRING,
  },
  language: {
    type: Sequelize.STRING,
  },
  pubDate: {
    type: Sequelize.DATE,
  },
  authors: {
    type: Sequelize.STRING,
  },
  subjects: {
    type: Sequelize.STRING,
  },
});

module.exports = Book;
