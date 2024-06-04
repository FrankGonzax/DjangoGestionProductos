function abrirCategoria(){
    document.getElementById('admin').style.display = 'none';
    document.getElementById('categoria').style.display = 'block';
    document.getElementById('producto').style.display = 'none'; 
}
function abrirProducto(){
    document.getElementById('admin').style.display = 'none';
    document.getElementById('categoria').style.display = 'none';
    document.getElementById('producto').style.display = 'block';
    obtenerCategorias();

}
function cancelar(){
    document.getElementById('admin').style.display = 'block';
    document.getElementById('categoria').style.display = 'none';
    document.getElementById('producto').style.display = 'none'; 
    document.getElementById('opciones').innerHTML='';
}

function registrarCategoria(){
    let categoria = document.getElementById('nombrecategoria').value;
    if(categoria.length > 0){
        const url = 'http://127.0.0.1:8000/productos/crearCategoria/';
        const csrftoken = getCookie('csrftoken');
        const data = {
            nombre: categoria,
            csrfmiddlewaretoken: csrftoken
          };
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
              'Origin': 'http://127.0.0.1:8000'
            },
            body: JSON.stringify(data)
          };
        fetch(url, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Respuesta de la API:', data);
            document.getElementById('nombrecategoria').value = '';
            alert('Categoria registrada correctamente.');
          })
          .catch(error => {
            console.error('Error al enviar la solicitud:', error);
            alert('Error en el servidor.');
          });
    }
    else{
        alert('Ingrese un nombre para la categoría.');
    }
}

function obtenerCategorias(){
  const url = 'http://127.0.0.1:8000/productos/crearCategoria/';
  const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://127.0.0.1:8000'
    }
  };

  fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta de la API (GET):', data);
        if (data && data.categorias) {
          const categoriasList = JSON.parse(data.categorias).map(categoria => ({
              codigo: categoria.pk,
              nombre: categoria.fields.nombre,
          }));
          // Haz algo con categoriasList aquí
          if(categoriasList.length > 0){
            const elemento = document.getElementById("opciones");
            categoriasList.forEach(objeto => {
              // Crea un elemento de opción
              const optionElement = document.createElement("option");
              // Establece el valor y el texto de la opción
              optionElement.value = objeto.codigo;
              optionElement.textContent = objeto.nombre;
              
              // Agrega la opción al elemento select
              elemento.appendChild(optionElement);
            });
          }
          else{
            document.getElementById('labelcat').innerHTML = 'Aún no hay categorias registradas.'
          }
        } else {
          console.error('No se recibieron categorias válidas del servidor');
        }
    })
    .catch(error => {
        console.error('Error al enviar la solicitud GET:', error);
        alert('Error en el servidor.');
    });
}

function registrarProducto(){
  let nombre = document.getElementById('nombreproducto').value;
  let stock = document.getElementById('stockproducto').value;
  let descripcion = document.getElementById('descripcionproducto').value;
  let categoria = document.getElementById('opciones').value;

  if(descripcion.length==0){
    descripcion = '';
  }
  if(categoria.length >= 4){
    if (nombre.length > 0){
      if(/^[0-9]+$/.test(stock) == true){
           const url = 'http://127.0.0.1:8000/productos/crearProducto/';
           const csrftoken = getCookie('csrftoken');
           const data = {
            nombre: nombre,
            stock: stock,
            descripcion: descripcion,
            categoria: categoria,
            csrfmiddlewaretoken: csrftoken
           };
           const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
              'Origin': 'http://127.0.0.1:8000'
            },
            body: JSON.stringify(data)
           };
           fetch(url, requestOptions)
           .then(response => response.json())
           .then(data => {
            console.log('Respuesta de la API:', data);
            document.getElementById('nombreproducto').value = '';
            document.getElementById('stockproducto').value = '';
            document.getElementById('descripcionproducto').value = '';
            alert('Categoria registrada correctamente.');
           })
           .catch(error => {
            console.error('Error al enviar la solicitud:', error);
            alert('Error en el servidor.');
           });
      }
      else{
        alert('Error con el stock de producto.')
      }
    }
    else{
      alert('Error con nombre del producto.');
    }
  }
  else{
    alert('Error con la categoría.');
  }

}










function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}