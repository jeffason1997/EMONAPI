class energieRecord {
    constructor() {
        this.Id;                
        this.Time;              
        this.ToClient1;     //kWh    
        this.ToClient2;     //kWh    
        this.FromClient1;   //kWh    
        this.FromClient2;   //kWh    
        this.CurrentTo;     //W
        this.CurrentFrom;   //W
        this.CurrentTarif;  
    }
}

module.exports = energieRecord;