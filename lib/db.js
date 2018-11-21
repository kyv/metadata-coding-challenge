const Sequelize = require('sequelize');

const storage = (process.env.NODE_ENV === 'test') ? './db.test.sqlite' : 'db.sqlite';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,

  logging: false,
  storage,
  // omitNull doesn't seem to be respected
  // perhaps do to the chosen engine
  omitNull: true,
});

sequelize.authenticate();

module.exports = sequelize;
