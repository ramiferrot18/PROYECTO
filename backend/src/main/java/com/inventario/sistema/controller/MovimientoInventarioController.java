package com.inventario.sistema.controller;

import com.inventario.sistema.model.MovimientoInventario;
import com.inventario.sistema.service.MovimientoInventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "http://localhost:4200")
public class MovimientoInventarioController {
    
    @Autowired
    private MovimientoInventarioService movimientoService;
    
    @GetMapping
    public List<MovimientoInventario> getAllMovimientos() {
        return movimientoService.getAllMovimientos();
    }
    
    @GetMapping("/{id}")
    public Optional<MovimientoInventario> getMovimientoById(@PathVariable Long id) {
        return movimientoService.getMovimientoById(id);
    }
    
    @PostMapping
    public MovimientoInventario createMovimiento(@RequestBody MovimientoInventario movimiento) {
        return movimientoService.saveMovimiento(movimiento);
    }
    
    @PutMapping("/{id}")
    public MovimientoInventario updateMovimiento(@PathVariable Long id, @RequestBody MovimientoInventario movimiento) {
        movimiento.setIdMovimiento(id);
        return movimientoService.saveMovimiento(movimiento);
    }
    
    @DeleteMapping("/{id}")
    public void deleteMovimiento(@PathVariable Long id) {
        movimientoService.deleteMovimiento(id);
    }
    
    @GetMapping("/producto/{productoId}")
    public List<MovimientoInventario> getMovimientosByProducto(@PathVariable Long productoId) {
        return movimientoService.getMovimientosByProducto(productoId);
    }
}