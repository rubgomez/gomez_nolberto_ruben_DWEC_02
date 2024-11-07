class GastoCombustible{

    //constructor
    constructor(vehicleType, date, kilometers, precioViaje ){
        this.vehicleType=vehicleType
        this.date=date
        this.kilometers=kilometers
        this.precioViaje=precioViaje
    }

    //metodos
    convertToJSO(){
        return JSON.stringify(this)
    }

}

export default GastoCombustible; 