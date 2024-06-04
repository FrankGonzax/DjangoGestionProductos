function abrirModificar(codigo, nombre, categoria, stock, descripcion){
    document.getElementById('table-container').style.display='none';
    document.getElementById('d_modificar').style.display='block';
    document.getElementById('met').style.display='none';
    document.getElementById('divl2').innerHTML = `<label class="l2">${nombre}</label>`;
    document.getElementById('divl3').innerHTML = `<label class="l2">${categoria}</label>`;
    document.getElementById('stockm').value = stock;
    document.getElementById('descripcionm').value = descripcion;
    let html = `<button class="la" onclick="modificarProducto('${codigo}')">Aceptar</button>
    <button class="lc" onclick="cancelarModificar()">Cancelar</button>`;
    document.getElementById('l3').innerHTML = html;
}
function cancelarModificar(){
    document.getElementById('table-container').style.display='block';
    document.getElementById('d_modificar').style.display='none';
    document.getElementById('met').style.display='block';
    document.getElementById('l3').innerHTML = '';
}
document.addEventListener("DOMContentLoaded", function(event) {
    // Aquí va tu función que quieres ejecutar cuando la página se carga
    obtenerProductos();
    obtenerCat();
});
  
  function obtenerProductos() {
    const url = 'http://127.0.0.1:8000/productos/obtenerProductos/';
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
        if (data && data.productos) {
          const productosList = data.productos.map(producto => ({
              codigo: producto.codigo,
              nombre: producto.nombre,
              categoria: producto.categoria,
              stock: producto.stock, 
              descripcion: producto.descripcion
          }));
          // Haz algo con categoriasList aquí
          if(productosList.length > 0){
            let cabezera = `<tr>
            <th></th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Stock</th>
            <th>Descripción</th>
            <th>Acciones</th>
            </tr>`;
            let i = 1;
            let html = ``;
            productosList.forEach(objeto => {
              html += `<tr>
              <td>Producto ${i}</td>
              <td>${objeto.nombre}</td>
              <td>${objeto.categoria}</td>
              <td>${objeto.stock}</td>
              <td>${objeto.descripcion}</td>
              <td><button class="be" onclick="eliminarProducto('${objeto.codigo}')">Eliminar</button><button class="bm" onclick="abrirModificar('${objeto.codigo}', '${objeto.nombre}', '${objeto.categoria}', '${objeto.stock}', '${objeto.descripcion}')">Modificar</button></td>
              </tr>`
              i++;
            });
            let total = cabezera + html;
            document.getElementById('productos').innerHTML=total;
          }
          else{
            document.getElementById('productos').innerHTML = 'Aún no hay productos registrados.'
          }
        } else {
          console.error('No se recibieron productos válidos del servidor');
        }
    })
    .catch(error => {
        console.error('Error al enviar la solicitud GET:', error);
        alert('Error en el servidor.');
    });
  }


function modificarProducto(codigo){
  let stock = document.getElementById('stockm').value;
  let descripcion = document.getElementById('descripcionm').value;
  if(/^[0-9]+$/.test(stock) == true){
    const url = 'http://127.0.0.1:8000/productos/modificarProducto/';
    const csrftoken = getCookie('csrftoken');
    const data = {
        codigo: codigo,
        stock: stock,
        descripcion: descripcion,
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
        //Actualizar la pagina
        alert('Producto modificado correctamente.');
        obtenerProductos();
        document.getElementById('d_modificar').style.display='none';
        document.getElementById('table-container').style.display='block';
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        alert('Error en el servidor.');
      });
  }
  else{
    alert('Error con el stock.');
  }
}

function eliminarProducto(codigo){
  if (confirm("¿Estás seguro de eliminar el producto?")) {
    const url = 'http://127.0.0.1:8000/productos/eliminarProducto/';
    const csrftoken = getCookie('csrftoken');
    const data = {
        codigo: codigo,
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
        //Actualizar la pagina
        alert('Producto eliminado correctamente.');
        obtenerProductos();
        document.getElementById('d_modificar').style.display='none';
        document.getElementById('table-container').style.display='block';
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        alert('Error en el servidor.');
      });
  } else {

  }
}

function obtenerCat(){
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
              optionElement.value = objeto.nombre;
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

function buscarProducto(){
  let nombre = '';
  let categoria = '';
  let stock = '';
  nombre = document.getElementById('nombreb').value;
  stock = document.getElementById('stockb').value;
  categoria = document.getElementById('opciones').value;
  const csrftoken = getCookie('csrftoken');


  if(nombre.length == 0){
    nombre = '';
  }
  if(categoria.length == 0){
    categoria = '';
  }
  if(stock.length == 0){
    stock = '';
  }

  if(categoria == 'n'){
    categoria = '';
  }

  const url = 'http://127.0.0.1:8000/productos/buscarProducto/';
  const data = {
    stock: stock,
    nombre: nombre,
    categoria: categoria
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
      console.log('Respuesta de la API (GET):', data);
      if (data && data.productos) {
        const productosList = data.productos.map(producto => ({
            codigo: producto.codigo,
            nombre: producto.nombre,
            categoria: producto.categoria,
            stock: producto.stock, 
            descripcion: producto.descripcion
        }));
        // Haz algo con categoriasList aquí
        if(productosList.length > 0){
          let cabezera = `<tr>
          <th></th>
          <th>Nombre</th>
          <th>Categoria</th>
          <th>Stock</th>
          <th>Descripción</th>
          <th>Acciones</th>
          </tr>`;
          let i = 1;
          let html = ``;
          productosList.forEach(objeto => {
            html += `<tr>
            <td>Producto ${i}</td>
            <td>${objeto.nombre}</td>
            <td>${objeto.categoria}</td>
            <td>${objeto.stock}</td>
            <td>${objeto.descripcion}</td>
            <td><button class="be" onclick="eliminarProducto('${objeto.codigo}')">Eliminar</button><button class="bm" onclick="abrirModificar('${objeto.codigo}', '${objeto.nombre}', '${objeto.categoria}', '${objeto.stock}', '${objeto.descripcion}')">Modificar</button></td>
            </tr>`
            i++;
          });
          let total = cabezera + html;
          document.getElementById('productos').innerHTML=total;
        }
        else{
          document.getElementById('productos').innerHTML = 'Aún no hay productos registrados.'
        }
      } else {
        console.error('No se recibieron productos válidos del servidor');
      }
  })
  .catch(error => {
      console.error('Error al enviar la solicitud GET:', error);
      alert('Error en el servidor.');
  });
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