const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ApiError = require('./ApiError');
const expressSwagger = require('express-swagger-generator');
const StorageRoutes = require('./routes/storage.routes');
const _ = require('./database/db.connector')

const httpSchemes = process.env.NODE_ENV === 'production' ? ['https'] : ['http']

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const options = {
    swaggerDefinition: {
        info: {
            title: 'Emon API',
            version: '1.0.0',
            description: ''
        },
        host: process.env.ALLOW_ORIGIN,
        produces: [
            'application/json'
        ],
        securityDefinition: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'x-access-token',
                description: 'registreer bij Jeffrey'
            }
        },
        schemes: httpSchemes
    },
    basedir: __dirname,
    files: ['.routes/**/*.js']
};
expressSwagger(options);



app.use(cors());
app.use(express.static('./static'));
app.use('/api', StorageRoutes);

app.use('*', (req, res, next) => {
    const error = new ApiError('Non-existing endpoint', 404);
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.code || 404).json(err).end();
});

// Netjes afsluiten
function shutdown() {
    if (process.env.NODE_ENV === 'production') {
    }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

const server = app.listen(420,'192.168.0.103', () => {
    console.log('The magic happens at port ' + server.address().port)
});

module.exports = server;


