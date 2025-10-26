package com.inventario.sistema.controller;

import com.inventario.sistema.model.Producto;
import com.inventario.sistema.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }
    
    @GetMapping("/{id}")
    public Optional<Producto> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id);
    }
    
    @GetMapping("/codigo-barras/{codigoBarras}")
    public Optional<Producto> getProductoByCodigoBarras(@PathVariable String codigoBarras) {
        return productoService.getProductoByCodigoBarras(codigoBarras);
    }
    
    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoService.saveProducto(producto);
    }
    
    @PutMapping("/{id}")
    public Producto updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        producto.setIdProducto(id);
        return productoService.saveProducto(producto);
    }
    
    @DeleteMapping("/{id}")
    public void deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
    }
    
    @GetMapping("/search")
    public List<Producto> searchProductos(@RequestParam String nombre) {
        return productoService.searchProductos(nombre);
    }
    
    @GetMapping("/categoria/{categoriaId}")
    public List<Producto> getProductosByCategoria(@PathVariable Long categoriaId) {
        return productoService.getProductosByCategoria(categoriaId);
    }
    
    @GetMapping("/bajo-stock")
    public List<Producto> getProductosBajoStock() {
        return productoService.getProductosBajoStock();
    }
}