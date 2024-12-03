
//esta funcion es para obtener los datos
async function obtenerDatos() {
    // esta variable entonces va abtener toda la informacion de los paise que estan en el local
    const datosGuardados = localStorage.getItem('paises');
    
    // revisamos que tiene la variable 
    if (datosGuardados != null) {
        // lo convertimos a un objeto.
        const paises = JSON.parse(datosGuardados);
        // y llamamos a cargar paises  
        CargarListaPaises(paises);  
    } else {
        console.log('No se encontraron datos en localStorage, realizando una nueva solicitud a la API.');
        // si no estan entoces hacemos la peticion 
        await obtenerPaises();  //esta funcion esta en el otro script en el index
    }
}

obtenerDatos();


//esta funcion es para filtrar por region.
function filtrarPorRegion() {

    const region = document.getElementById('lblRegion').value.trim().toLowerCase();
    const paisesAlmacenados = JSON.parse(localStorage.getItem('paises'));

    if (region === "") {
        CargarListaPaises(paisesAlmacenados); //si no sepone ninguna entonces que cargue todos
    } else {
        const paisesFiltrados = paisesAlmacenados.filter(pais => pais.region.toLowerCase().includes(region)); //aqui buscamos a los paises de esa region
        CargarListaPaises(paisesFiltrados); 
    }
}

document.getElementById('lblRegion').addEventListener('change', filtrarPorRegion); // Llamar al filtrar cuando cambia la región


