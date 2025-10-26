package com.inventario.sistema.repository;

import com.inventario.sistema.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    Optional<Producto> findByCodigoBarras(String codigoBarras);
    
    List<Producto> findByNombreProductoContainingIgnoreCase(String nombre);
    
    List<Producto> findByCategoriaIdCategoria(Long idCategoria);
    
    @Query("SELECT p FROM Producto p WHERE p.stockActual <= p.stockMinimo AND p.activo = true")
    List<Producto> findProductosBajoStock();
    
    boolean existsByCodigoBarras(String codigoBarras);
}