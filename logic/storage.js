const energieRecord = require('../models/energieRecord');
const meting = require('../models/meting')

class storage {
    constructor() {

    }

    createRecord(rawText) {
        var record = new energieRecord();
        var lines = rawText.split("\r\n");

        record.Id = (lines.filter(o => o.includes('0-0:96.1.1')))[0].split('(')[1].split(')')[0];
        let date = (lines.filter(o => o.includes('0-0:1.0.0')))[0].split('(')[1].split(')')[0].match(/.{1,2}/g);
        record.Time = new Date(20 + date[0], date[1] - 1, date[2], date[3], date[4], date[5]);
        record.ToClient1 = (lines.filter(o => o.includes('1-0:1.8.1')))[0].split('(')[1].split('*')[0];
        record.ToClient2 = (lines.filter(o => o.includes('1-0:1.8.2')))[0].split('(')[1].split('*')[0];
        record.FromClient1 = (lines.filter(o => o.includes('1-0:2.8.1')))[0].split('(')[1].split('*')[0];
        record.FromClient2 = (lines.filter(o => o.includes('1-0:2.8.2')))[0].split('(')[1].split('*')[0];
        record.CurrentTo = ((lines.filter(o => o.includes('1-0:1.7.0')))[0].split('(')[1].split('*')[0]) * 1000;
        record.CurrentFrom = ((lines.filter(o => o.includes('1-0:2.7.0')))[0].split('(')[1].split('*')[0]) * 1000;
        record.CurrentTarif = (lines.filter(o => o.includes('0-0:96.14.0')))[0].split('(')[1].split(')')[0];

        return record;
    }

    createMetingRecord(jsonText) {
        let record = new meting()
        record.MacAddres = jsonText["mac"];
        record.Time = jsonText["datetime"];
        record.InsideTempature= jsonText["temp"];
        record.Humidity = jsonText["hum"];
        return record
    }
}

module.exports = storage;
