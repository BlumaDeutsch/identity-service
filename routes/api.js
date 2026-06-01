const router = require('express').Router();

module.exports = (knex) => {
  router.use('/projects', require('./projects')(knex));
  router.use('/users', require('./users')(knex));
  return router;
};