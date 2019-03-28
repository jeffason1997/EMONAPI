let routes = require('express').Router();
const EnergieController = require('../controllers/storage.controller')

// Berichten CRUD
routes.post('/energie', EnergieController.saveEnergie);
routes.get('/energie/:id', EnergieController.getEnergie);
routes.get('/newEnergie/:id', EnergieController.getLatestEnergie);
routes.post('/meting', EnergieController.saveMeting);
routes.get('/meting/:id', EnergieController.getMeting);
routes.get('/newmeting/:id', EnergieController.getLatestMeting);

module.exports = routes;
