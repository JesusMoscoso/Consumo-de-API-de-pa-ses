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

//esta funcion es para cargar la lista de paises.
function CargarListaPaises(paisesAlmacenados) {
    //este la ul en donde se van a cargar la los li.
    const lista = document.getElementById('listaPaises');
    //vaciamos el contenedor.
    lista.innerHTML = '';

    //recorremos los paisesAlmacenados
    paisesAlmacenados.forEach(pais => {
        //creamos un li por cada iteracion
        const item = document.createElement('li');
        //creamos un boton por cada iteracion
        const botonDetalles = document.createElement('button');
    
        botonDetalles.textContent = 'Detalles';
        botonDetalles.classList.add('btn', 'waves-effect', 'waves-light', 'blue', 'boton-derecha');

        //le agregamos el evento a cada boton y le pasamos todo el pais
        botonDetalles.addEventListener('click', () => {
            mostrarDetalles(pais);  
        });

        //cada li tendra el nombre del pais
        item.textContent = pais.name.common;
        
        item.appendChild(botonDetalles);
        lista.appendChild(item);
    });
}

window.addEventListener('load', () => {
    const paisSeleccionado = JSON.parse(localStorage.getItem('paisSeleccionado'));

    if (paisSeleccionado) {
        const lblPais = document.getElementById('lblPais');
        lblPais.value = paisSeleccionado.name.common;  // nombre del país

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

        // verificamos si los datos del país están disponibles en localStorage
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
