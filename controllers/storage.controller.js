const ApiError = require('../ApiError');
const mysql = require('../database/db.connector')
const storage = require('../logic/storage')
const dateFormatter = require('../logic/dateFormatter')
const calculations = require('../logic/calculation');

module.exports = {

    getEnergie(req, res, next) {
        let id = req.params.id;
        let begin = dateFormatter.SqlDate(new Date(req.query.begin));
        let eind = dateFormatter.SqlDate(new Date(req.query.eind),1);
        let type = req.query.sort;
        let sql;
        if(begin.includes('NaN') || eind.includes('NaN')){
            sql = `SELECT tijdstip,verbruik,opgeleverd FROM energiemeting
            WHERE serienummer = ${id}`
        }else {
            sql = `SELECT tijdstip,verbruik,opgeleverd FROM energiemeting
            WHERE serienummer = ${id} AND tijdstip BETWEEN '${begin}' AND '${eind}'`;
        }
        mysql.query(sql, (err, result, fields) => {
            if (err) {
                res.send(new ApiError(err.toString(), 500))
            } else if(begin >= eind && sql.includes("BETWEEN")){
                res.send(new ApiError("End day before Begin day", 501));
            } else {
                res.status(200).send(calculations.sorting(result, type));
            }
        })
    },

    getLatestEnergie(req, res, next){
        let id = req.params.id;
        let sql = `SELECT opgenomen_tarief_1, opgenomen_tarief_2, teruggeleverd_tarief_1, teruggeleverd_tarief_2, verbruik, opgeleverd, huidig_tarief FROM energiemeting WHERE serienummer = ${id} ORDER BY tijdstip DESC LIMIT 1`;
        mysql.query(sql, (err, result, fields) => {
            if (err) {
                res.send(new ApiError(err.toString(), 500))
            } else {
                res.status(200).send(result)
            }
        })
    },

    saveEnergie(req, res, next) {
        try {
            record = new storage().createRecord(req.body);
            let sql = 'INSERT INTO energiemeting VALUES (?,?,?,?,?,?,?,?,?)';
            let todo = [record.Id, record.Time, record.ToClient1, record.ToClient2, record.FromClient1, record.FromClient2, record.CurrentTo, record.CurrentFrom, record.CurrentTarif];

            mysql.query(sql, todo, (err, result, fields) => {
                if (err) {
                    if (err.toString().includes('ER_NO_REFERENCED_ROW')) {
                        let kastSql = 'INSERT INTO energiemeter VALUES(?)';
                        let kastTodo = [record.Id];
                        mysql.query(kastSql, kastTodo, (err, result, fields) => {
                            if (err) { res.send(new ApiError(err.toString(), 501)); }
                            else {
                                mysql.query(sql, todo, (err, result, fields) => {
                                    if (err) { res.send(new ApiError(err.toString(), 502)); }
                                    else { res.status(200).send("Added new"); }
                                });
                            }
                        });
                    } else { res.send(new ApiError(req.body, 503)); }
                } else { res.status(200).send("Added"); }
            });
        } catch (error) { res.send(new ApiError(err.toString(), 500)); }

    },
    
    getMeting(req, res, next) {
        let id = req.params.id;
        let begin = dateFormatter.SqlDate(new Date(req.query.begin));
        let eind = dateFormatter.SqlDate(new Date(req.query.eind),1);
        let type = req.query.sort;
        let sql;
        if(begin.includes('NaN') || eind.includes('NaN')){
            sql = `SELECT tijdstip, temperatuur_binnen, luchtvochtigheid FROM sensormeting WHERE 
            mac_adres = ${id}`
        }else {
            sql = `SELECT tijdstip, temperatuur_binnen, luchtvochtigheid FROM sensormeting WHERE 
            mac_adres = ${id} AND tijdstip BETWEEN '${begin}' AND '${eind}'`;
        }

        mysql.query(sql, (err, result, fields) => {
            if (err) {
                res.send(new ApiError(err.toString(), 500))
            } else if(begin >= eind && sql.includes("BETWEEN")){
                res.send(new ApiError("End day before Begin day", 501));
            } else {
                res.status(200).send(calculations.sortingMeting(result, type))
            }
        })
    },

    getLatestMeting(req, res, next){
        let id = req.params.id;
        let sql = `SELECT temperatuur_binnen, luchtvochtigheid FROM sensormeting WHERE mac_adres = ${id} ORDER BY tijdstip DESC LIMIT 1`;
        mysql.query(sql, (err, result, fields) => {
            if (err) {
                res.send(new ApiError(err.toString(), 500))
            } else {
                res.status(200).send(result)
            }
        })
    },

    saveMeting(req, res, next) {
        try {
            let record = new storage().createMetingRecord(req.body)
            let sql = 'INSERT INTO sensormeting(mac_adres, tijdstip, temperatuur_binnen, luchtvochtigheid) VALUES (?,?,?,?)';
            let todo = [record.MacAddres, record.Time, record.InsideTempature, record.Humidity];
            mysql.query(sql, todo, (err, result, fields) => {
                if (err) {
                    if (err.toString().includes('ER_NO_REFERENCED_ROW')) {
                        let groepSql = 'INSERT INTO sensorgroep VALUES(?)';
                        let groepTodo = [record.MacAddres];
                        mysql.query(groepSql, groepTodo, (err, result, fields) => {
                            if (err) { res.send(new ApiError(err.toString(), 501)); }
                            else {
                                mysql.query(sql, todo, (err, result, fields) => {
                                    if (err) { res.send(new ApiError(err.toString(), 502)); }
                                    else { res.status(200).send("Added new"); }
                                });
                            }
                        });
                    } else { res.send(new ApiError(err.toString(), 503)); }
                } else { res.status(200).send("Added"); }
            });
        } catch (error) { res.send(new ApiError(err.toString(), 500)); }
    },

    getAllHuizen(req, res, next) {
        try {
            let sql = "select * from huis";
            mysql.query(sql, (err, result, fields) => {
                if(err) {res.send(new ApiError(err.toString(), 501));}
                else {
                    res.send(result);
                }
            });
        } catch (error) { res.send(new ApiError(err.toString(), 500)); }

    },
    
    getSerieNummerAndMACadresFromHouseWithId(req, res, next) {
        try {
            let id = req.params.id;
            let sql = "select serienummer,mac_adres from huis WHERE huis_id = " + id;
            mysql.query(sql, (err, result, fields) => {
                if(err) {res.send(new ApiError(err.toString(), 501));}
                else {
                    res.send(result);
                }
            });
        } catch (error) { res.send(new ApiError(err.toString(), 500)); }
    }
}
