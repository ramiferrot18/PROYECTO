package com.inventario.sistema.service;

import com.inventario.sistema.model.DetalleVenta;
import com.inventario.sistema.model.Producto;
import com.inventario.sistema.model.Venta;
import com.inventario.sistema.repository.ProductoRepository;
import com.inventario.sistema.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VentaService {
    
    @Autowired
    private VentaRepository ventaRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Venta> getAllVentas() {
        return ventaRepository.findAllByOrderByFechaVentaDesc();
    }
    
    public Optional<Venta> getVentaById(Long id) {
        return ventaRepository.findById(id);
    }
    
    @Transactional
    public Venta saveVenta(Venta venta) {
        List<DetalleVenta> detallesActualizados = new ArrayList<>();
        
        // Actualizar el stock de los productos y crear nuevos detalles
        for (DetalleVenta detalle : venta.getDetalles()) {
            // Obtener el producto fresco de la base de datos
            Producto productoActual = productoRepository.findById(detalle.getProducto().getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detalle.getProducto().getIdProducto()));
            
            // Verificar stock suficiente
            if (productoActual.getStockActual() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + productoActual.getNombreProducto());
            }
            
            // Actualizar el stock
            productoActual.setStockActual(productoActual.getStockActual() - detalle.getCantidad());
            productoRepository.save(productoActual);
            
            // Crear un nuevo detalle de venta con la referencia completa al producto
            DetalleVenta nuevoDetalle = new DetalleVenta(
                venta,
                productoActual,
                detalle.getCantidad(),
                detalle.getPrecioUnitario()
            );
            
            detallesActualizados.add(nuevoDetalle);
        }
        
        // Establecer la fecha de venta
        if (venta.getFechaVenta() == null) {
            venta.setFechaVenta(LocalDateTime.now());
        }
        
        // Actualizar los detalles de la venta
        venta.setDetalles(detallesActualizados);
        
        // Establecer fecha de venta si no está establecida
        if (venta.getFechaVenta() == null) {
            venta.setFechaVenta(LocalDateTime.now());
        }
        
        // Guardar la venta
        return ventaRepository.save(venta);
    }
    
    public void deleteVenta(Long id) {
        ventaRepository.deleteById(id);
    }
    
    public List<Venta> getVentasPorFecha(String fechaInicio, String fechaFin) {
        LocalDateTime inicio = LocalDate.parse(fechaInicio).atStartOfDay();
        LocalDateTime fin = LocalDate.parse(fechaFin).atTime(23, 59, 59);
        System.out.println("Buscando ventas entre " + inicio + " y " + fin);
        
        List<Venta> ventas = ventaRepository.findByFechaVentaBetweenOrderByFechaVentaDesc(inicio, fin);
        System.out.println("Encontradas " + ventas.size() + " ventas");
        
        for (Venta venta : ventas) {
            System.out.println("Venta ID: " + venta.getIdVenta());
            System.out.println("  Fecha: " + venta.getFechaVenta());
            System.out.println("  Total: " + venta.getTotalVenta());
            System.out.println("  Método de pago: " + venta.getMetodoPago());
            System.out.println("  Número de detalles: " + venta.getDetalles().size());
            
            for (DetalleVenta detalle : venta.getDetalles()) {
                System.out.println("    Producto: " + detalle.getProducto().getNombreProducto());
                System.out.println("    Cantidad: " + detalle.getCantidad());
                System.out.println("    Precio unitario: " + detalle.getPrecioUnitario());
                System.out.println("    Importe total: " + detalle.getImporteTotal());
            }
        }
        
        return ventas;
    }
}