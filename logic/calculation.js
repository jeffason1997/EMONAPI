const EnergieRecord = require('../models/energieRecord');
const Meting = require('../models/meting');
const dateformatter = require('./dateFormatter.js');

class calculations {
    sorting(data, sort = "Minuut") {
        let date = new Date(data[0].tijdstip);
        let perTimeArray = [];
        let finalArray = [];
        for (let row in data) {
            let tempDate = new Date(data[row]["tijdstip"]);
            if (this.sortingTime(date, tempDate, sort) && row != data.length-1) {
                perTimeArray.push(data[row]);
            } else {
                if(row != data.length-1)   perTimeArray.push(data[row]);
                let record = new EnergieRecord();
                record.Time = dateformatter.UserDate(perTimeArray[0].tijdstip, sort);
                record.CurrentTo = Math.round(perTimeArray.reduce((total, add) => total + add.verbruik, 0) / (perTimeArray.length-1));
                record.CurrentFrom = Math.round(perTimeArray.reduce((total, add)=> total + add.opgeleverd, 0) / (perTimeArray.length-1));
                date = data[row].tijdstip;
                perTimeArray = [];
                if(row != data.length-1)   perTimeArray.push(data[row]);
                finalArray.push(record);
            }
        }
        return finalArray;
    }

    sortingMeting(data, sort = "Minuut"){
        let date = new Date(data[0].tijdstip);
        let perTimeArray = [];
        let finalArray = [];
        for (let row in data) {
            let tempDate = new Date(data[row]["tijdstip"]);
            if (this.sortingTime(date, tempDate, sort) && row != data.length-1) {
                perTimeArray.push(data[row]);
            } else {
                if(row != data.length-1)   perTimeArray.push(data[row]);
                let record = new Meting();
                record.Time = dateformatter.UserDate(perTimeArray[0].tijdstip, sort);
                record.InsideTemperature = Math.round(perTimeArray.reduce((total, add) => total + add.temperatuur_binnen, 0) / (perTimeArray.length));
                
                record.Humidity = Math.round(perTimeArray.reduce((total, add)=> total + add.luchtvochtigheid, 0) / (perTimeArray.length));
                date = data[row].tijdstip;
                perTimeArray = [];
                if(row != data.length-1)   perTimeArray.push(data[row]);
                finalArray.push(record);
            }
        }
        return finalArray;
    }

    sortingTime(originalDate, compareDate, mode) {
        if (mode == "Minuut") {
            return originalDate.getMinutes() === compareDate.getMinutes();
        } else if (mode == "Uur") {
            return originalDate.getHours() === compareDate.getHours();
        } else if (mode == "Dag") {
            return originalDate.getDay() === compareDate.getDay();
        } else if (mode == "Maand") {
            return originalDate.getMonth() === compareDate.getMonth();
        } else {
            return null;
        }
    }
}

module.exports = new calculations();