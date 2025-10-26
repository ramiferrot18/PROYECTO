package com.inventario.sistema.repository;

import com.inventario.sistema.model.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {
    List<DetalleCompra> findByCompraIdCompra(Long idCompra);
}