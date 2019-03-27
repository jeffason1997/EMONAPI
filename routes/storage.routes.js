let routes = require('express').Router();
const EnergieController = require('../controllers/storage.controller')

// Berichten CRUD
routes.post('/energie', EnergieController.saveEnergie);
routes.get('/energie', EnergieController.getEnergie);
routes.get('/newEnergie', EnergieController.getLatestEnergie);
routes.post('/meting', EnergieController.saveMeting);
routes.get('/meting', EnergieController.getMeting);
routes.get('/newmeting', EnergieController.getLatestMeting);

module.exports = routes;
