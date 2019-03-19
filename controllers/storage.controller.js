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
let sql = 'INSERT INTO energiemeting VALUES (?,?,?,?,?,?,?,?,?)';
let todo = [record.Id, record.Time, record.ToClient1, record.ToClient2, record.FromClient1, record.FromClient2, record.CurrentTo, record.CurrentFrom, 1];
mysql.query(sql,todo, (err, result, fields) => {
	if(err){
		if(err.toString().includes('ER_NO_REFERENCED_ROW')){
			console.log("Nieuwe Kast Bruuuur");
		let kastSql = 'INSERT INTO energiemeter VALUES(?)';
		let kastTodo = [record.Id];
		mysql.query(kastSql, kastTodo, (err, result, fields) => {
			if(err){
				res.send(new ApiError(err.toString(),569));
			} else {
				console.log('nieuw kast gemaakt bruuur');
			}
});
		}else {
		res.send(new ApiError(err.toString(), 510));
	}} else {
		res.status(200).send(record);
	
	}});
        } catch (err){
            res.send(new ApiError(err.toString(), 500));
        }
    }
};
