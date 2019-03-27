let routes = require('express').Router();
const EnergieController = require('../controllers/storage.controller')

// Berichten CRUD
routes.post('/energie', EnergieController.saveEnergie);
routes.get('/energie', EnergieController.getEnergie);
routes.post('/meting', EnergieController.saveMeting);

module.exports = routes;
