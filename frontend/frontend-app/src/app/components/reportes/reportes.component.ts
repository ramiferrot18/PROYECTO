import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService, Venta, DetalleVenta } from '../../services/venta.service';
import { Producto } from '../../services/producto.service';

interface ReporteIngresos {
  ingresosTotales: number;
  costosTotales: number;
  gananciaNeta: number;
  margenGanancia: number;
}

interface ProductoVendido {
  producto: string;
  cantidadVendida: number;
  ingresosGenerados: number;
}

interface VentaPorDia {
  fecha: string;
  totalVentas: number;
  cantidadVentas: number;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="fw-bold">📊 Reportes y Análisis</h2>
          <p class="text-muted">Analiza el rendimiento de tu tienda</p>
        </div>
      </div>

      <!-- Filtros Simples -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-6">
              <label class="form-label">Fecha Inicio</label>
              <input type="date" class="form-control" [(ngModel)]="fechaInicio" (change)="cargarReportes()">
            </div>
            <div class="col-md-6">
              <label class="form-label">Fecha Fin</label>
              <input type="date" class="form-control" [(ngModel)]="fechaFin" (change)="cargarReportes()">
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Columna Izquierda - Métricas y Productos -->
        <div class="col-md-4">
          <!-- Ganancias por Período -->
          <div class="card mb-4">
            <div class="card-header bg-light">
              <h6 class="mb-0">💰 Ganancias por Período</h6>
              <small class="text-muted">Análisis de rentabilidad</small>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4">
                  <div class="border-end">
                    <h4 class="text-success fw-bold">{{ formatPrecio(reporteIngresos.ingresosTotales) }}</h4>
                    <small class="text-muted">Ingresos</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="border-end">
                    <h4 class="text-warning fw-bold">{{ formatPrecio(reporteIngresos.costosTotales) }}</h4>
                    <small class="text-muted">Costos</small>
                  </div>
                </div>
                <div class="col-4">
                  <div>
                    <h4 class="text-primary fw-bold">{{ formatPrecio(reporteIngresos.gananciaNeta) }}</h4>
                    <small class="text-muted">Ganancia</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Productos Más Vendidos -->
          <div class="card">
            <div class="card-header bg-light">
              <h6 class="mb-0">🏆 Productos Más Vendidos</h6>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <div *ngFor="let producto of productosMasVendidos; let i = index" 
                     class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <span class="fw-medium">{{ producto.producto }}</span>
                  </div>
                  <span class="badge bg-primary rounded-pill">
                    {{ producto.cantidadVendida }} vendido{{ producto.cantidadVendida !== 1 ? 's' : '' }}
                  </span>
                </div>
                <div *ngIf="productosMasVendidos.length === 0" class="list-group-item text-center text-muted">
                  No hay datos de ventas
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha - Gráfico de Tendencia -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-light">
              <h6 class="mb-0">📈 Tendencia de Ventas</h6>
            </div>
            <div class="card-body">
              <!-- Gráfico de Barras Verticales -->
              <div class="chart-container" style="height: 300px;">
                <div class="d-flex align-items-end h-100" style="gap: 15px; padding: 0 40px;">
                  <!-- Eje Y (valores) -->
                  <div class="d-flex flex-column justify-content-between h-100 me-3" style="width: 40px;">
                    <small class="text-muted text-end">{{ getMaxVentas() }}°</small>
                    <small class="text-muted text-end">{{ getMaxVentas() * 0.75 }}°</small>
                    <small class="text-muted text-end">{{ getMaxVentas() * 0.5 }}°</small>
                    <small class="text-muted text-end">{{ getMaxVentas() * 0.25 }}°</small>
                    <small class="text-muted text-end">0°</small>
                  </div>
                  
                  <!-- Barras -->
                  <div class="d-flex align-items-end justify-content-between w-100" style="gap: 12px;">
                    <div *ngFor="let dia of ventasPorDia" 
                         class="d-flex flex-column align-items-center" 
                         style="flex: 1; max-width: 60px;">
                      <!-- Barra -->
                      <div class="bg-primary rounded-top position-relative" 
                           [style.height.px]="getAlturaColumna(dia.totalVentas)"
                           style="width: 35px; transition: height 0.3s ease; min-height: 5px;"
                           [title]="'$' + formatPrecio(dia.totalVentas)">
                        <!-- Valor sobre la barra -->
                        <div class="position-absolute top-0 start-50 translate-middle-x mt-1">
                          <small class="text-dark fw-bold" style="font-size: 10px;">
                            {{ formatPrecioCorta(dia.totalVentas) }}
                          </small>
                        </div>
                      </div>
                      
                      <!-- Fecha -->
                      <small class="mt-2 text-center" style="font-size: 10px; line-height: 1.2;">
                        {{ formatFechaCorta(dia.fecha) }}
                      </small>
                    </div>
                  </div>
                </div>
                
                <!-- Línea de eje X -->
                <div class="border-top mt-2 pt-2"></div>
              </div>
            </div>
          </div>

          <!-- Resumen Adicional -->
          <div class="row mt-4">
            <div class="col-md-4">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-info">{{ ventasFiltradas.length }}</h3>
                  <small class="text-muted">Total Ventas</small>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-success">{{ getTotalProductosVendidos() }}</h3>
                  <small class="text-muted">Productos Vendidos</small>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-warning">{{ reporteIngresos.margenGanancia }}%</h3>
                  <small class="text-muted">Margen Ganancia</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Generando reportes...</p>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
    }
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-header {
      border-bottom: 1px solid #e9ecef;
      background-color: #f8f9fa !important;
    }
    .list-group-item {
      border: none;
      padding: 12px 16px;
    }
    .bg-primary {
      background: linear-gradient(135deg, #007bff, #0056b3) !important;
    }
  `]
})
export class ReportesComponent implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  reporteIngresos: ReporteIngresos = {
    ingresosTotales: 0,
    costosTotales: 0,
    gananciaNeta: 0,
    margenGanancia: 0
  };
  productosMasVendidos: ProductoVendido[] = [];
  ventasPorDia: VentaPorDia[] = [];
  fechaInicio: string;
  fechaFin: string;
  cargando: boolean = false;

  constructor(private ventaService: VentaService) {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);

    this.fechaInicio = hace7Dias.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.cargarReportes();
  }

  cargarReportes() {
    this.cargando = true;
    console.log('Cargando reportes desde:', this.fechaInicio, 'hasta:', this.fechaFin);

    this.ventaService.getVentasPorFecha(this.fechaInicio, this.fechaFin).subscribe({
      next: (ventas) => {
        this.ventas = ventas;
        this.filtrarVentasPorFecha();
        this.calcularReporteIngresos();
        this.calcularProductosMasVendidos();
        this.calcularVentasPorDia();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando ventas:', error);
        this.cargando = false;
      }
    });
  }

  filtrarVentasPorFecha() {
    console.log('Filtrando ventas por fecha');
    this.ventasFiltradas = this.ventas;

    if (!this.fechaInicio || !this.fechaFin) {
      console.log('No hay fechas de filtro, usando todas las ventas');
      return;
    }

    // Crear fechas en hora local a partir de YYYY-MM-DD para evitar el parsing como UTC
    const [yi, mi, di] = this.fechaInicio.split('-').map(s => parseInt(s, 10));
    const [yf, mf, df] = this.fechaFin.split('-').map(s => parseInt(s, 10));

    const inicio = new Date(yi, mi - 1, di, 0, 0, 0, 0);
    const fin = new Date(yf, mf - 1, df, 23, 59, 59, 999);

    console.log('Fecha inicio original:', this.fechaInicio, '->', inicio);
    console.log('Fecha fin original:', this.fechaFin, '->', fin);

    this.ventasFiltradas = this.ventas.filter(venta => {
      if (!venta.fechaVenta) {
        console.log('Venta sin fecha:', venta);
        return false;
      }
      const fechaVenta = new Date(venta.fechaVenta);
      const incluir = fechaVenta >= inicio && fechaVenta <= fin;
      console.log('Fecha venta:', fechaVenta, 'Incluir:', incluir);
      return incluir;
    });
  }

  calcularReporteIngresos() {
    console.log('Calculando ingresos para', this.ventasFiltradas.length, 'ventas');
    let ingresosTotales = 0;
    let costosTotales = 0;

    this.ventasFiltradas.forEach(venta => {
      console.log('Procesando venta:', venta);
      console.log('Total venta:', venta.totalVenta);
      const totalVenta = typeof venta.totalVenta === 'string' ? 
        parseFloat(venta.totalVenta) : 
        (venta.totalVenta || 0);
      
      ingresosTotales += totalVenta;
      console.log('Ingresos acumulados:', ingresosTotales);
      
      if (venta.detalles && Array.isArray(venta.detalles)) {
        venta.detalles.forEach(detalle => {
          console.log('Procesando detalle:', detalle);
          console.log('Producto en detalle:', detalle.producto);
          
          if (detalle.producto && typeof detalle.producto.precioCompra !== 'undefined') {
            const precioCompra = typeof detalle.producto.precioCompra === 'string' ? 
              parseFloat(detalle.producto.precioCompra) : 
              detalle.producto.precioCompra;
              
            const cantidad = typeof detalle.cantidad === 'string' ? 
              parseInt(detalle.cantidad) : 
              (detalle.cantidad || 0);
              
            const costo = precioCompra * cantidad;
            costosTotales += costo;
            
            console.log('Precio compra:', precioCompra);
            console.log('Cantidad:', cantidad);
            console.log('Costo calculado:', costo);
            console.log('Costos acumulados:', costosTotales);
          }
        });
      }
    });

    const gananciaNeta = ingresosTotales - costosTotales;
    const margenGanancia = ingresosTotales > 0 ? (gananciaNeta / ingresosTotales) * 100 : 0;

    this.reporteIngresos = {
      ingresosTotales,
      costosTotales,
      gananciaNeta,
      margenGanancia: Number(margenGanancia.toFixed(1))
    };
  }

  calcularProductosMasVendidos() {
    console.log('Calculando productos más vendidos');
    const productosMap = new Map<string, ProductoVendido>();

    this.ventasFiltradas.forEach(venta => {
      if (!venta.detalles) return;
      
      venta.detalles.forEach(detalle => {
        if (!detalle.producto) {
          console.log('Detalle sin producto:', detalle);
          return;
        }

        const nombreProducto = detalle.producto.nombreProducto || 'Producto Desconocido';
        const cantidad = Number(detalle.cantidad || 0);
        const ingresos = Number(detalle.importeTotal || 0);

        console.log('Procesando venta de producto:', nombreProducto, cantidad, ingresos);

        if (productosMap.has(nombreProducto)) {
          const productoExistente = productosMap.get(nombreProducto)!;
          productoExistente.cantidadVendida += cantidad;
          productoExistente.ingresosGenerados += ingresos;
        } else {
          productosMap.set(nombreProducto, {
            producto: nombreProducto,
            cantidadVendida: cantidad,
            ingresosGenerados: ingresos
          });
        }
      });
    });

    this.productosMasVendidos = Array.from(productosMap.values())
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, 8);
  }

  calcularVentasPorDia() {
    const ventasPorDiaMap = new Map<string, VentaPorDia>();

    this.ventasFiltradas.forEach(venta => {
      if (!venta.fechaVenta) return;

      // Usar fecha local para agrupar (evitar desplazamientos por UTC)
      const fv = new Date(venta.fechaVenta);
      const y = fv.getFullYear();
      const m = String(fv.getMonth() + 1).padStart(2, '0');
      const d = String(fv.getDate()).padStart(2, '0');
      const fecha = `${y}-${m}-${d}`;

      const totalVentaNum = typeof venta.totalVenta === 'string' ? parseFloat(venta.totalVenta) : Number(venta.totalVenta || 0);

      if (ventasPorDiaMap.has(fecha)) {
        const diaExistente = ventasPorDiaMap.get(fecha)!;
        diaExistente.totalVentas += totalVentaNum;
        diaExistente.cantidadVentas += 1;
      } else {
        ventasPorDiaMap.set(fecha, {
          fecha: fecha,
          totalVentas: totalVentaNum,
          cantidadVentas: 1
        });
      }
    });

    this.ventasPorDia = Array.from(ventasPorDiaMap.values())
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(-6);
  }

  formatPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }

  formatPrecioCorta(precio: number): string {
    if (precio >= 1000) return `$${(precio/1000).toFixed(0)}k`;
    return `$${precio.toFixed(0)}`;
  }

  formatFechaCorta(fecha: string): string {
    if (!fecha) return 'N/A';

    // Manejar dos formatos comunes:
    // - Fecha completa con hora (ISO): '2025-11-01T12:34:56Z' -> se puede parsear directamente
    // - Fecha local en formato 'YYYY-MM-DD' generada internamente -> crear Date en hora local
    try {
      if (fecha.includes('T')) {
        return new Date(fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit'
        });
      }

      const parts = fecha.split('-');
      if (parts.length >= 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return new Date(y, m, d).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit'
        });
      }

      // Fallback
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      });
    } catch (e) {
      console.warn('Formato de fecha desconocido en formatFechaCorta:', fecha, e);
      return fecha;
    }
  }

  getAlturaColumna(totalVentas: number): number {
    const maxVentas = this.getMaxVentas();
    if (maxVentas === 0) return 5;
    return Math.max((totalVentas / maxVentas) * 200, 5);
  }

  getMaxVentas(): number {
    if (this.ventasPorDia.length === 0) return 100;
    return Math.max(...this.ventasPorDia.map(d => d.totalVentas), 100);
  }

  getTotalProductosVendidos(): number {
    return this.productosMasVendidos.reduce((total, producto) => total + producto.cantidadVendida, 0);
  }
}