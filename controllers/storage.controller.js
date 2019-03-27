const ApiError = require('../ApiError');
const mysql = require('../database/db.connector')
const storage = require('../logic/storage')

module.exports = {

    getEnergie(req, res, next) {
        let sql = `SELECT tijdstip,opgenomen_tarief_1,opgenomen_tarief_2,teruggeleverd_tarief_1,teruggeleverd_tarief_2,verbruik,opgeleverd,huidig_tarief FROM energiemeting`;
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

    saveMeting(req, res, next) {
	try {
	    console.log('Meting received for saving' + JSON.stringify(req.body))
	    let record = new storage().createMetingRecord(req.body)
	    res.send('ok')
	} catch (error) {console.log(error);res.send('ok')}
    }

};
