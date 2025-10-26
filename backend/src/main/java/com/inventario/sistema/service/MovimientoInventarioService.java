package com.inventario.sistema.service;

import com.inventario.sistema.model.MovimientoInventario;
import com.inventario.sistema.repository.MovimientoInventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovimientoInventarioService {
    
    @Autowired
    private MovimientoInventarioRepository movimientoRepository;
    
    public List<MovimientoInventario> getAllMovimientos() {
        return movimientoRepository.findAll();
    }
    
    public Optional<MovimientoInventario> getMovimientoById(Long id) {
        return movimientoRepository.findById(id);
    }
    
    public MovimientoInventario saveMovimiento(MovimientoInventario movimiento) {
        return movimientoRepository.save(movimiento);
    }
    
    public void deleteMovimiento(Long id) {
        movimientoRepository.deleteById(id);
    }
    
    public List<MovimientoInventario> getMovimientosByProducto(Long idProducto) {
        return movimientoRepository.findByProductoIdProducto(idProducto);
    }
}