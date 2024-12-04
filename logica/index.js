// esta funcion es para obtener los datos desde la api
async function obtenerPaises() {
    try {
        // hacemos la peticion a la api
        const respuesta = await fetch('https://restcountries.com/v3.1/all');
        // aqui lo convertimos en un objeto por que viene en un formato de texto entonces como un parseo
        const datos = await respuesta.json(); 
        // Si datos es mayor a 0, significa que obtuvimos información
        if (datos.length > 0) {
            //guardamos en el local.
            localStorage.setItem('paises', JSON.stringify(datos));
            // esta variable ahora tiene toda la informacion
            const paisesAlmacenados = JSON.parse(localStorage.getItem('paises'));
            //console.log(paisesAlmacenados);
            CargarListaPaises(paisesAlmacenados); //aqui lo que hacemos es llamar a la funcion y pasarle la lista de todos los paises
        } else {
            //en caso de que no se cargue los datos o que esten vacios
            alert('No se pudo cargar los datos.');
        }
    } catch (error) {
        console.log('Error al cargar los datos', error);
    }
}

obtenerPaises();

// esta funcion es para cargar la lista de paises.
function CargarListaPaises(paisesAlmacenados) {
    // este es el contenedor donde se van a cargar las tarjetas.
    const lista = document.getElementById('listaPaises');
    // vaciamos el contenedor.
    lista.innerHTML = '';

    // recorremos los países almacenados
    paisesAlmacenados.forEach(pais => {
        // creamos el contenedor de la tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('col', 's12', 'm4'); 

        // creamos la estructura de la tarjeta
        const card = document.createElement('div');
        card.classList.add('card');

        // creamos el contenido de la tarjeta
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        // creamos el nombre del pais
        const nombrePais = document.createElement('span');
        nombrePais.classList.add('card-title');
        nombrePais.textContent = pais.name.common;

        // agregamos el nombre del pais a la tarjeta
        cardContent.appendChild(nombrePais);

        // agregamos el contenido a la tarjeta
        card.appendChild(cardContent);

    
        const cardAction = document.createElement('div');
        cardAction.classList.add('card-action');

        
        const botonDetalles = document.createElement('a');
        botonDetalles.classList.add('btn', 'blue');
        botonDetalles.textContent = 'Detalles';

        // le agregamos el evento a cada boton
        botonDetalles.addEventListener('click', () => {
            mostrarDetalles(pais);
        });

        // agregamos el boton 
        cardAction.appendChild(botonDetalles);

        // agregamos la accion a la tarjeta
        card.appendChild(cardAction);

        // agregamos la tarjeta al div
        tarjeta.appendChild(card);

        //agregamos la tarjeta a la lista
        lista.appendChild(tarjeta);
    });
}


window.addEventListener('load', () => {
    const paisSeleccionado = JSON.parse(localStorage.getItem('paisSeleccionado'));

    if (paisSeleccionado) {
        const lblPais = document.getElementById('lblPais');
        lblPais.value = paisSeleccionado.name.common;  // nombre del pais

        setTimeout(() => {
            BuscarPais();  // Realiza la búsqueda después de que lblPais se haya actualizado
        }, 0);
    }
})


// esta funcion es para buscar un pais.
function BuscarPais() {
    //obtenemos el nombre que viene en el lbl, borramos los espacios vacios y convertimos a minuscula. 
    const nombre = document.getElementById('lblPais').value.trim().toLowerCase();
    //aqui lo que hacemos es obtener los datos que fueron guardados en local con la clave paises.
    const paisesAlmacenados = JSON.parse(localStorage.getItem('paises'));
    //este es el contendedo donde estan los li con el nombre de los paises.
    const contenedor = document.getElementById('listaPaises');
    //limpiamos por que vamos cargar los que contegan el nombre que viene en el lbl
    contenedor.innerHTML = '';

    //si el nombre esta vacio cargamos  
    if (nombre === "") {
        CargarListaPaises(paisesAlmacenados);   
    } 
    else {
        // si no entonces filtramos a los que tengan en el nombre el nombre que viene en el lbl.
        const paisesFiltrados = paisesAlmacenados.filter(pais =>pais.name.common.toLowerCase().includes(nombre));
        CargarListaPaises(paisesFiltrados);
    }
}

// esta funcion muestra los detalles de un pais
function mostrarDetalles(pais) {
    try {
        // Guardamos el país seleccionado en localStorage
        localStorage.setItem('paisSeleccionado', JSON.stringify(pais));

        // verificamos si los datos del pais estan disponibles en localStorage
        const paisesAlmacenados = JSON.parse(localStorage.getItem('paises'));

        //si se borraron o si no hay6 nada entonces mostramos un mensaje,
        if (!paisesAlmacenados || paisesAlmacenados.length === 0) {
            alert('No se encontraron datos disponibles para mostrar.');
            return;
        }

        // Si los datos están disponibles, cargamos los detalles
        const contenidoModal = document.getElementById('detallePais');
        contenidoModal.innerHTML = `
            <p><strong>Bandera:</strong></p>
            <img src="${pais.flags.png}" alt="Bandera de ${pais.name.common}" width="200px" height="auto">
            <p><strong>Nombre del País:</strong> ${pais.name.common}</p>
            <p><strong>Nombre Oficial:</strong> ${pais.name.official}</p>
            <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : 'No disponible'}</p>
            <p><strong>Población:</strong> ${pais.population}</p>
            <p><strong>Idioma:</strong> ${Object.values(pais.languages).join(', ')}</p>
        `;

        // abrir el modal
        const modal = document.getElementById('modalDetalles');
        const instanciaModal = M.Modal.getInstance(modal);
        instanciaModal.open();

    } catch (error) {
        console.log('Error al mostrar detalles del país:', error);
    }
}



 
//al presionar enter en el campo de texto entonces buscamos
document.getElementById('lblPais').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  
        const nuevoPais = event.target.value.trim().toLowerCase();
        if (nuevoPais) {
           
            localStorage.setItem('paisSeleccionado', JSON.stringify({ name: { common: nuevoPais } }));
            BuscarPais(); 
        } 
    }
});



const btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', BuscarPais);
