let routes = require('express').Router();
const EnergieController = require('../controllers/storage.controller')

// Berichten CRUD
routes.post('/energie', EnergieController.postEnergie);
routes.get('/energie', EnergieController.getEnergie);
routes.post('/test',EnergieController.saveEnergie)

module.exports = routes;