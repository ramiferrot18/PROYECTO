package com.inventario.sistema.controller;

import com.inventario.sistema.model.Venta;
import com.inventario.sistema.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:4200")
public class VentaController {
    
    @Autowired
    private VentaService ventaService;
    
    @GetMapping
    public List<Venta> getAllVentas() {
        return ventaService.getAllVentas();
    }
    
    @GetMapping("/{id}")
    public Optional<Venta> getVentaById(@PathVariable Long id) {
        return ventaService.getVentaById(id);
    }
    
    @PostMapping
    public Venta createVenta(@RequestBody Venta venta) {
        return ventaService.saveVenta(venta);
    }
    
    @PutMapping("/{id}")
    public Venta updateVenta(@PathVariable Long id, @RequestBody Venta venta) {
        venta.setIdVenta(id);
        return ventaService.saveVenta(venta);
    }
    
    @DeleteMapping("/{id}")
    public void deleteVenta(@PathVariable Long id) {
        ventaService.deleteVenta(id);
    }
}