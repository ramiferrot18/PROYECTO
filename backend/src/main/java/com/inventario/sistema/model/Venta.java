package com.inventario.sistema.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ventas")
public class Venta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Long idVenta;
    
    @Column(name = "folio_venta", unique = true, length = 20)
    private String folioVenta;
    
    @Column(name = "total_venta", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalVenta;
    
    @Column(name = "pago_efectivo", precision = 10, scale = 2)
    private BigDecimal pagoEfectivo;
    
    @Column(name = "pago_tarjeta", precision = 10, scale = 2)
    private BigDecimal pagoTarjeta;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal cambio;
    
    @Column(name = "fecha_venta")
    private LocalDateTime fechaVenta;
    
    @Column(length = 100)
    private String usuario;
    
    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleVenta> detalles = new ArrayList<>();
    
    // Constructores
    public Venta() {}
    
    public Venta(String folioVenta, BigDecimal totalVenta, String usuario) {
        this.folioVenta = folioVenta;
        this.totalVenta = totalVenta;
        this.usuario = usuario;
        this.fechaVenta = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        if (fechaVenta == null) {
            fechaVenta = LocalDateTime.now();
        }
    }
    
    // Getters y Setters
    public Long getIdVenta() { return idVenta; }
    public void setIdVenta(Long idVenta) { this.idVenta = idVenta; }
    
    public String getFolioVenta() { return folioVenta; }
    public void setFolioVenta(String folioVenta) { this.folioVenta = folioVenta; }
    
    public BigDecimal getTotalVenta() { return totalVenta; }
    public void setTotalVenta(BigDecimal totalVenta) { this.totalVenta = totalVenta; }
    
    public BigDecimal getPagoEfectivo() { return pagoEfectivo; }
    public void setPagoEfectivo(BigDecimal pagoEfectivo) { this.pagoEfectivo = pagoEfectivo; }
    
    public BigDecimal getPagoTarjeta() { return pagoTarjeta; }
    public void setPagoTarjeta(BigDecimal pagoTarjeta) { this.pagoTarjeta = pagoTarjeta; }
    
    public BigDecimal getCambio() { return cambio; }
    public void setCambio(BigDecimal cambio) { this.cambio = cambio; }
    
    public LocalDateTime getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(LocalDateTime fechaVenta) { this.fechaVenta = fechaVenta; }
    
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    
    public List<DetalleVenta> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVenta> detalles) { this.detalles = detalles; }
}