from django.urls import path
from . import views

app_name = 'productos'  

urlpatterns = [
    path('', views.index, name='index'),
    path('viewProductos/', views.view_obtenerProductos, name='viewProductos'),
    path('crearCategoria/', views.CrearCategoriaView.as_view(), name='crearCategoria'),
    path('crearProducto/', views.CrearProducto.as_view(), name='crearProducto'),
    path('modificarProducto/', views.ModificarProducto.as_view(), name='modificarProducto'),
    path('eliminarProducto/', views.EliminarProducto.as_view(), name='eliminarProducto'),
    path('obtenerProductos/', views.ObtenerProducto.as_view(), name='obtenerProductos'),
    path('buscarProducto/', views.BuscarProducto.as_view(), name='buscarProducto'),
]