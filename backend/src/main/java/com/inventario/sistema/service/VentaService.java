package com.inventario.sistema.service;

import com.inventario.sistema.model.Venta;
import com.inventario.sistema.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VentaService {
    
    @Autowired
    private VentaRepository ventaRepository;
    
    public List<Venta> getAllVentas() {
        return ventaRepository.findAll();
    }
    
    public Optional<Venta> getVentaById(Long id) {
        return ventaRepository.findById(id);
    }
    
    public Venta saveVenta(Venta venta) {
        return ventaRepository.save(venta);
    }
    
    public void deleteVenta(Long id) {
        ventaRepository.deleteById(id);
    }
}