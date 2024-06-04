def filtro_producto(opcion, nombre, stock, categoria):
    if(opcion == 1):
        if(len(nombre) > 0):
            if(stock.isdigit()):
                if(len(categoria) >= 4):
                    return True
                else:
                    return False
            else:
                return False
        else:
            return False
    elif(opcion == 2):
        if(stock.isdigit()):
            return True
        else:
            return False
        
def opciones_busqueda_producto(nombre, categoria, stock):
    if(nombre == None):
        nombre = ''
    if(categoria == None):
        categoria = ''
    if(stock == None):
        stock = ''
    if(len(nombre) >= 1 and len(categoria) >= 1 and len(stock) >= 1):
        return 1
    elif(len(nombre) >= 1 and len(categoria) >= 1):
        return 2
    elif(len(nombre) >= 1 and len(stock) >= 1):
        return 3
    elif(len(categoria) >= 1 and len(stock) >= 1):
        return 4
    elif(len(nombre) >= 1):
        return 5
    elif(len(categoria) >= 1):
        return 6
    elif(len(stock) >= 1):
        return 7
    
def devolver_lista(productos):
    productos_data = []
    for producto in productos:
        producto_data = {
            'nombre': producto.nombre,
            'codigo': producto.codigo,
            'categoria': producto.categoria.nombre,
            'stock': producto.stock,
            'descripcion': producto.descripcion
        }
        productos_data.append(producto_data)
    
    return productos_data