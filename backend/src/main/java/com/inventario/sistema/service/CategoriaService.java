package com.inventario.sistema.service;

import com.inventario.sistema.model.Categoria;
import com.inventario.sistema.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }
    
    public Optional<Categoria> getCategoriaById(Long id) {
        return categoriaRepository.findById(id);
    }
    
    public Categoria saveCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
    
    public void deleteCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }
}