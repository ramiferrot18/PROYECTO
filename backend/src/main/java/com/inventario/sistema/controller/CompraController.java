package com.inventario.sistema.controller;

import com.inventario.sistema.model.Compra;
import com.inventario.sistema.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/compras")
@CrossOrigin(origins = "http://localhost:4200")
public class CompraController {
    
    @Autowired
    private CompraService compraService;
    
    @GetMapping
    public List<Compra> getAllCompras() {
        return compraService.getAllCompras();
    }
    
    @GetMapping("/{id}")
    public Optional<Compra> getCompraById(@PathVariable Long id) {
        return compraService.getCompraById(id);
    }
    
    @PostMapping
    public Compra createCompra(@RequestBody Compra compra) {
        return compraService.saveCompra(compra);
    }
    
    @PutMapping("/{id}")
    public Compra updateCompra(@PathVariable Long id, @RequestBody Compra compra) {
        compra.setIdCompra(id);
        return compraService.saveCompra(compra);
    }
    
    @DeleteMapping("/{id}")
    public void deleteCompra(@PathVariable Long id) {
        compraService.deleteCompra(id);
    }
}