// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
//*** 2b. Incluir en las variables tarifasJSONpath y gastosJSONpath la ruta de los ficheros de datos
let tarifasJSONpath = './data/tarifasCombustible.json';
let gastosJSONpath = './data/gastosCombustible.json';

//importo la clase en otro fichero
import GastoCombustible from './gastos.js';

//cambio aquí la declaración del array para que sea accesible desde todo el js
let aniosArray=null;
// variable para almacenar datos añadidos de forma manual
let gastos=[];

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    //*** a. Modifica el calendario para que solo puedan añadirse fechas entre 2010 y 2020

    //selecciono el elemento que se va ha modificar
    const dateInput = document.getElementById('date');
    //asingo las fechas que determinaran el valor minimo y máximo
    const minimo="2010-01-01";
    const maximo="2020-12-31";
    //modifico los atributos del elemenot
    dateInput.setAttribute('min', minimo);
    dateInput.setAttribute('max', maximo);

    //*** c. Calcula los gastos entre 2010 y 2020 usando la función calcularGastoTotal().
    //*** d. Muestra el importe del gasto total para cada año en el apartado “Gastos Totales:” 

    //recorro todos los gastos, determinando por cada registro el año y el precio
    for (let i=0; i<gastosJSON.length; i++){

        //saco el precio como float para poder después operar con el
        const precio=parseFloat(gastosJSON[i].precioViaje);

        //saco la fecha
        const fechastrin=gastosJSON[i].date;
        //saco el año de la fecha
        const fecha = new Date(fechastrin);
        const ano = fecha.getFullYear();
       
        actualizaarray(ano,precio);    
        
    }   

}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const kilometros = parseFloat(document.getElementById('kilometers').value);
    const datofecha = document.getElementById('date').value;
    //saco el año de la fecha
    const fecha = new Date(datofecha);
    const ano = fecha.getFullYear();
    

    let precio=null;

//*** i. Recorre la variable asociada al fichero de tarifas, busca la correspondiente al 
// tipo de vehículo y fecha, y finalmente calcula el gasto y almacénalo
    
    for (let i=0; i<tarifasJSON.tarifas.length; i++){
        const tarifaanio=parseFloat(tarifasJSON.tarifas[i].anio);

        const tarifafurgoneta=parseFloat(tarifasJSON.tarifas[i].vehiculos.furgoneta);

        const tarifamoto=parseFloat(tarifasJSON.tarifas[i].vehiculos.moto);

        const tarifacamion=parseFloat(tarifasJSON.tarifas[i].vehiculos.camion);

        if(ano==tarifaanio){
            switch(tipoVehiculo){

                case 'furgoneta':
                    precio=kilometros*tarifafurgoneta                
                break

                case 'moto':
                    precio=kilometros*tarifamoto           
                break

                case 'camion':
                    precio=kilometros*tarifacamion      
                break
            }

        }

    }

    // genero el gasto y utilizo el método para recibir los datos en json
    let migasto=new GastoCombustible(tipoVehiculo,fecha,kilometros,precio).convertToJSO()

    //añados el gasto en un array
    gastos.push(migasto);

//***  c. En “Gastos recientes:”,  muestra  en  una  nueva  fila  el  último  gasto  añadido  usando 
// convertToJSON().
    //actualizo el valor del array en el html
    document.getElementById('expense-list').innerText =gastos;
//***  d. Actualizará el gasto total correspondiente en el apartado “Gastos Totales:”
    //actualizo el valor del array en el html
    actualizaarray(ano,precio);  
//***  e. Dejará el formulario en blanco de nuevo  
    document.getElementById('kilometers').value =null;
}

function actualizaarray(ano,precio){

    //sumo el precio al valor existente en el array para ese año
    let total =parseFloat(aniosArray[ano])+precio;
    //lo redondeo a dos decimales para evitar 2.04+18.09=20.939999999999998
    total=total.toFixed(2);
    //meto el valor en el array
    aniosArray[ano]= total;

    //actualizo el valor del array en el html
    document.getElementById('gasto'+ano).innerText =aniosArray[ano];

}



