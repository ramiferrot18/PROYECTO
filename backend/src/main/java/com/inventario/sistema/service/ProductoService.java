package com.inventario.sistema.service;

import com.inventario.sistema.model.Producto;
import com.inventario.sistema.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }
    
    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }
    
    public Optional<Producto> getProductoByCodigoBarras(String codigoBarras) {
        return productoRepository.findByCodigoBarras(codigoBarras);
    }
    
    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }
    
    public List<Producto> searchProductos(String nombre) {
        return productoRepository.findByNombreProductoContainingIgnoreCase(nombre);
    }
    
    public List<Producto> getProductosByCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaIdCategoria(categoriaId);
    }
    
    public List<Producto> getProductosBajoStock() {
        return productoRepository.findProductosBajoStock();
    }
    
    public boolean existsByCodigoBarras(String codigoBarras) {
        return productoRepository.existsByCodigoBarras(codigoBarras);
    }
}