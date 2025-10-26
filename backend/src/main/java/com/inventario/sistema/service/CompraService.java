package com.inventario.sistema.service;

import com.inventario.sistema.model.Compra;
import com.inventario.sistema.repository.CompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompraService {
    
    @Autowired
    private CompraRepository compraRepository;
    
    public List<Compra> getAllCompras() {
        return compraRepository.findAll();
    }
    
    public Optional<Compra> getCompraById(Long id) {
        return compraRepository.findById(id);
    }
    
    public Compra saveCompra(Compra compra) {
        return compraRepository.save(compra);
    }
    
    public void deleteCompra(Long id) {
        compraRepository.deleteById(id);
    }
}