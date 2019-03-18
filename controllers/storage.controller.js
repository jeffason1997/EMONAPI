const ApiError = require('../ApiError');
const mysql = require('../database/db.connector')
const storage = require('../logic/storage')

module.exports = {
    postEnergie(req, res, next) {
        let sql = `INSERT INTO Testing(name,leeftijd,reg_date) VALUES(?,?,NOW())`;
        let todo = [req.body.naam, req.body.leeftijd]
        mysql.query(sql, todo, (err, result, fields) => {
            if (err) {
                console.log("error")
                res.send(new ApiError(err.toString(), 500))
            } else {
                console.log("done")
                res.status(200).send("done")
            }
        })
    },

    getEnergie(req, res, next) {
        let sql = `SELECT name,leeftijd,reg_date FROM Testing`;
        mysql.query(sql, (err, result, fields) => {
            if (err) {
                res.send(new ApiError(err.toString(), 500))
            } else {
                res.status(200).send(result)
            }
        })
    },

    saveEnergie(req, res, next) {
        let record = 0;
        try {
            record = new storage().createRecord(req.body.info);
        } catch (err){
            res.send(new ApiError(err.toString(), 500))
        }
        res.status(200).send(record)
    }
};