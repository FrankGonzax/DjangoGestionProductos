from django.shortcuts import render
from django.views import View
from .models import Categoria, Producto
from django.core import serializers
from django.http import JsonResponse
import json
from .filtros import filtro_producto, opciones_busqueda_producto, devolver_lista



def index(request):
    return render(request, 'index.html')

def view_obtenerProductos(request):
    return render(request, 'obproductos.html')

class CrearCategoriaView(View):
    def get(self, request):
        if request.method == 'GET':
            try:
                categorias = Categoria.objects.all()
                serialized_categorias = serializers.serialize('json', categorias)
                return JsonResponse({'categorias': serialized_categorias}, status=200)
            except Categoria.DoesNotExist:
                return JsonResponse({'mensaje': 'error'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid'}, status=405)

    def post(self, request):
        if request.method == 'POST':
            # Leer el cuerpo de la solicitud y decodificar el JSON
            data = json.loads(request.body)
            # Obtener el valor de 'nombre' del JSON
            nombre_categoria = data.get('nombre')
            #Crear codigo
            try:
                ultimo_codigo_insertado = Categoria.objects.latest('codigo')
                cont = int(ultimo_codigo_insertado.codigo[3:]) + 1
                codigo = 'Cat' + str(cont)
                categoria = Categoria(codigo = codigo, nombre = nombre_categoria)
                categoria.save()
                # Operación exitosa
                return JsonResponse({'mensaje': 'Exito'}, status=200)
            except Categoria.DoesNotExist:
                codigo = 'Cat1'
                categoria = Categoria(codigo = codigo, nombre = nombre_categoria)
                categoria.save()
                # Operación exitosa
                return JsonResponse({'mensaje': 'Exito'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid'}, status=405)
        

class CrearProducto(View):

    def post(self, request):
        if request.method == 'POST':
            data = json.loads(request.body)
            # Obtener el valor de 'nombre' del JSON
            nombre_producto = data.get('nombre')
            stock_producto = data.get('stock')
            descripcion_producto = data.get('descripcion')
            categoria_producto = data.get('categoria')
            #Crear codigo producto
            respuesta = filtro_producto(1, nombre_producto, stock_producto, categoria_producto)
            if (respuesta == True):
                try:
                    cat = Categoria.objects.get(codigo = categoria_producto)
                    try:
                        ultimo_codigo_insertado = Producto.objects.latest('codigo')
                        cont = int(ultimo_codigo_insertado.codigo[3:]) + 1
                        codigo = 'Pro' + str(cont)
                        producto = Producto(codigo = codigo, nombre = nombre_producto, stock = stock_producto, descripcion = descripcion_producto, categoria = cat)
                        producto.save()
                        # Operación exitosa
                        return JsonResponse({'mensaje': 'Exito'}, status=200)
                    except Producto.DoesNotExist:
                        codigo = 'Pro1'
                        producto = Producto(codigo = codigo, nombre = nombre_producto, stock = stock_producto, descripcion = descripcion_producto, categoria = cat)
                        producto.save()
                        # Operación exitosa
                        return JsonResponse({'mensaje': 'Exito'}, status=200)
                except Categoria.DoesNotExist:
                    # Error
                    print('aqui')
                    return JsonResponse({'mensaje': 'error'}, status=400)
            else:
                return JsonResponse({'mensaje': 'datos_incorrectos'})
        else:
            #Metodo no permitido
            return JsonResponse({'error': 'Invalid'}, status=405)

class ModificarProducto(View):
    def get(self, request):
        if (request.method == 'GET'):
            data = json.loads(request.body)
            codigo_producto = data.get('codigo')
            try:
                producto = Producto.objects.get(codigo = codigo_producto)
                return JsonResponse({'codigo': producto.codigo, 'nombre': producto.nombre, 'stock': producto.stock, 'descripcion': producto.descripcion, 'categoria': producto.categoria.nombre})
            except Producto.DoesNotExist:
                return JsonResponse({'mensaje': 'error'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid'}, status=405)

    def post(self, request):
        if (request.method == 'POST'):
            data = json.loads(request.body)
            codigo_producto = data.get('codigo')
            stock_producto = data.get('stock') 
            descripcion_producto = data.get('descripcion')
            respuesta = filtro_producto(2, "", stock_producto, "")
            if (respuesta == True):
                try:
                    producto = Producto.objects.get(codigo = codigo_producto)
                    producto.stock = stock_producto
                    producto.descripcion = descripcion_producto
                    producto.save()
                    return JsonResponse({'mensaje': 'exito'}, status=200)
                except Producto.DoesNotExist:
                    return JsonResponse({'mensaje': 'error'}, status=400)
            else:
                return JsonResponse({'mensaje': 'error'}, status=400)          
        else:
            return JsonResponse({'error': 'Invalid'}, status=405)


class EliminarProducto(View):
    def post(self, request):
        if (request.method == 'POST'):
            data = json.loads(request.body)
            codigo_producto = data.get('codigo')
            try:
                producto = Producto.objects.get(codigo = codigo_producto)
                producto.delete()
                return JsonResponse({'mensaje': 'exito'}, status=200)
            except Producto.DoesNotExist:
                return JsonResponse({'mensaje': 'error'}, status=400)
        else:
            return JsonResponse ({'mensaje': 'error'}, status=405)

class ObtenerProducto(View):
    def get(self, request):
        if(request.method == 'GET'):
            try:
                productos = Producto.objects.all()
                productos_data = []
                productos_data = devolver_lista(productos)
                return JsonResponse({'productos': productos_data}, status=200)
            except Producto.DoesNotExist:
                return JsonResponse({'mensaje': 'error'}, status=500)
        else:
            return JsonResponse ({'mensaje': 'error'}, status=405)


class BuscarProducto(View):
    def post(self, request):
        if (request.method == 'POST'):
            data = json.loads(request.body)
            nombre_producto = data.get('nombre')
            categoria_producto = data.get('categoria')
            stock_producto = data.get('stock')
            stock_producto = str(stock_producto)
            msj = opciones_busqueda_producto(nombre_producto, categoria_producto, stock_producto)
            if(msj == 1):
                #Buscar por categoria
                try:
                    cat = Categoria.objects.get(nombre = categoria_producto)
                    try:
                        productos = Producto.objects.filter(nombre = nombre_producto, categoria = cat, stock = stock_producto)
                        productos_data = []
                        productos_data = devolver_lista(productos)
                        return JsonResponse({'productos': productos_data}, status=200)
                    except Producto.DoesNotExist:
                        return JsonResponse({'mensaje': 'error'}, status=500)
                except Categoria.DoesNotExist:
                    return JsonResponse({'mensaje': 'error'}, status=500)
            elif(msj == 2):
                try:
                    cat = Categoria.objects.get(nombre = categoria_producto)
                    try:
                        productos = Producto.objects.filter(nombre = nombre_producto, categoria = cat)
                        productos_data = []
                        productos_data = devolver_lista(productos)
                        return JsonResponse({'productos': productos_data}, status=200)
                    except Producto.DoesNotExist:
                        return JsonResponse({'mensaje': 'error'}, status=500)
                except Categoria.DoesNotExist:
                    return JsonResponse({'mensaje': 'error'}, status=500)
            elif(msj == 3):
                try:
                    productos = Producto.objects.filter(nombre = nombre_producto, stock = stock_producto)
                    productos_data = []
                    productos_data = devolver_lista(productos)
                    return JsonResponse({'productos': productos_data}, status=200)
                except Producto.DoesNotExist:
                    return JsonResponse({'mensaje': 'error'}, status=500)
            elif(msj == 4):
                try:
                    cat = Categoria.objects.get(nombre = categoria_producto)
                    try:
                        productos = Producto.objects.filter(categoria = cat, stock = stock_producto)
                        productos_data = []
                        productos_data = devolver_lista(productos)
                        return JsonResponse({'productos': productos_data}, status=200)
                    except Producto.DoesNotExist:
                        return JsonResponse({'mensaje': 'error'}, status=500)
                except Categoria.DoesNotExist:
                    return JsonResponse({'mensaje': 'error'}, status=500)
            elif(msj == 5):
                try:
                    productos = Producto.objects.filter(nombre = nombre_producto)
                    productos_data = []
                    productos_data = devolver_lista(productos)
                    return JsonResponse({'productos': productos_data}, status=200)
                except Producto.DoesNotExist:
                    return JsonResponse({'mensaje': 'error'}, status=500)
            elif(msj == 6):
                try:
                    cat = Categoria.objects.get(nombre = categoria_producto)
                    try:
                        productos = Producto.objects.filter(categoria = cat)
                        productos_data = []
                        productos_data = devolver_lista(productos)
                        return JsonResponse({'productos': productos_data}, status=200)
                    except Producto.DoesNotExist:
                        return JsonResponse({'mensaje': 'error'}, status=500)
                except Categoria.DoesNotExist:
                    return JsonResponse({'mensaje': 'error'}, status=500)
            elif(msj == 7):
                try:
                    productos = Producto.objects.filter(stock = stock_producto)
                    productos_data = []
                    productos_data = devolver_lista(productos)
                    return JsonResponse({'productos': productos_data}, status=200)
                except Producto.DoesNotExist:
                    return JsonResponse({'mensaje': 'error'}, status=500)
            else:
                return JsonResponse({'mensaje': 'error'}, status=500)
        else:
            return JsonResponse({'mensaje': 'error'}, status=405)


