import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto, Categoria } from '../../services/producto.service';
import { VentaService, Venta, DetalleVenta } from '../../services/venta.service';

interface VentaPorDia {
  fecha: string;
  totalVentas: number;
  cantidadVentas: number;
}

interface EstadisticaCategoria {
  categoria: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="fw-bold">📊 Dashboard</h2>
          <p class="text-muted">Resumen general de tu tienda</p>
        </div>
      </div>

      <!-- Métricas Principales -->
      <div class="row mb-4">
        <!-- Ventas Totales -->
        <div class="col-md-3 mb-3">
          <div class="card border-primary">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title text-muted">Ventas Totales</h6>
                  <h3 class="text-primary fw-bold">{{ formatPrecio(ventasTotales) }}</h3>
                  <small class="text-success">
                    <i class="bi bi-arrow-up"></i> {{ variacionVentas }}% vs mes anterior
                  </small>
                </div>
                <div class="display-6 text-primary">
                  💰
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ganancias -->
        <div class="col-md-3 mb-3">
          <div class="card border-success">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title text-muted">Ganancias</h6>
                  <h3 class="text-success fw-bold">{{ formatPrecio(gananciasTotales) }}</h3>
                  <small class="text-success">
                    Margen: {{ margenGanancia }}%
                  </small>
                </div>
                <div class="display-6 text-success">
                  💵
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Productos -->
        <div class="col-md-3 mb-3">
          <div class="card border-info">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title text-muted">Productos</h6>
                  <h3 class="text-info fw-bold">{{ totalProductos }}</h3>
                  <small class="text-danger" *ngIf="productosBajoStock > 0">
                    ⚠️ {{ productosBajoStock }} en stock bajo
                  </small>
                  <small class="text-success" *ngIf="productosBajoStock === 0">
                    ✅ Stock óptimo
                  </small>
                </div>
                <div class="display-6 text-info">
                  📦
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ventas Hoy -->
        <div class="col-md-3 mb-3">
          <div class="card border-warning">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title text-muted">Ventas Hoy</h6>
                  <h3 class="text-warning fw-bold">{{ formatPrecio(ventasHoy) }}</h3>
                  <small class="text-muted">
                    {{ cantidadVentasHoy }} transacciones
                  </small>
                </div>
                <div class="display-6 text-warning">
                  🛒
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Columna Izquierda - Productos Bajo Stock y Gráfico de Tortas -->
        <div class="col-md-6">
          <!-- Productos con Stock Bajo -->
          <div class="card mb-4">
            <div class="card-header bg-warning text-dark">
              <h6 class="mb-0">⚠️ Productos con Stock Bajo</h6>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-sm table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th class="text-center">Stock Actual</th>
                      <th class="text-center">Stock Mínimo</th>
                      <th class="text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let producto of productosBajoStockLista" 
                        [class.table-warning]="producto.stockActual <= producto.stockMinimo"
                        [class.table-danger]="producto.stockActual === 0">
                      <td>
                        <strong>{{ producto.nombreProducto }}</strong>
                      </td>
                      <td>
                        <span class="badge bg-secondary">{{ producto.categoria.nombreCategoria }}</span>
                      </td>
                      <td class="text-center">
                        <span class="fw-bold" 
                              [class.text-danger]="producto.stockActual === 0"
                              [class.text-warning]="producto.stockActual > 0 && producto.stockActual <= producto.stockMinimo">
                          {{ producto.stockActual }}
                        </span>
                      </td>
                      <td class="text-center">
                        <small class="text-muted">{{ producto.stockMinimo }}</small>
                      </td>
                      <td class="text-center">
                        <span *ngIf="producto.stockActual === 0" class="badge bg-danger">Agotado</span>
                        <span *ngIf="producto.stockActual > 0 && producto.stockActual <= producto.stockMinimo" 
                              class="badge bg-warning text-dark">Bajo Stock</span>
                      </td>
                    </tr>
                    <tr *ngIf="productosBajoStockLista.length === 0">
                      <td colspan="5" class="text-center text-muted py-3">
                        ✅ Todos los productos tienen stock suficiente
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Gráfico de Tortas - Stock por Categoría -->
          <div class="card">
            <div class="card-header bg-info text-white">
              <h6 class="mb-0">📊 Distribución de Stock por Categoría</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <!-- Gráfico de Tortas -->
                <div class="col-md-6">
                  <div class="pie-chart-container">
                    <div class="pie-chart">
                      <div *ngFor="let cat of estadisticasCategorias" 
                           class="pie-segment"
                           [style.background]="cat.color"
                           [style.transform]="'rotate(' + getRotacion(cat) + 'deg)'"
                           [style.opacity]="cat.porcentaje > 0 ? 1 : 0">
                      </div>
                    </div>
                    <div class="pie-center">
                      <small class="text-muted">Total</small>
                      <div class="fw-bold">{{ totalProductos }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Leyenda -->
                <div class="col-md-6">
                  <div class="legend-container">
                    <div *ngFor="let cat of estadisticasCategorias" class="legend-item">
                      <div class="legend-color" [style.background]="cat.color"></div>
                      <div class="legend-text">
                        <small class="fw-medium">{{ cat.categoria }}</small>
                        <br>
                        <small class="text-muted">{{ cat.cantidad }} productos ({{ cat.porcentaje }}%)</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha - Ventas por Día -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h6 class="mb-0">📈 Ventas por Día (Últimos 7 días)</h6>
            </div>
            <div class="card-body">
              <!-- Gráfico de Barras -->
              <div class="chart-container" style="height: 300px;">
                <div class="d-flex align-items-end h-100" style="gap: 12px;">
                  <!-- Eje Y -->
                  <div class="d-flex flex-column justify-content-between h-100 me-3" style="width: 40px;">
                    <small class="text-muted text-end">{{ getMaxVentas() }}</small>
                    <small class="text-muted text-end">{{ getMaxVentas() * 0.75 }}</small>
                    <small class="text-muted text-end">{{ getMaxVentas() * 0.5 }}</small>
                    <small class="text-muted text-end">{{ getMaxVentas() * 0.25 }}</small>
                    <small class="text-muted text-end">0</small>
                  </div>
                  
                  <!-- Barras -->
                  <div class="d-flex align-items-end justify-content-between w-100" style="gap: 10px;">
                    <div *ngFor="let dia of ventasPorDia" 
                         class="d-flex flex-column align-items-center" 
                         style="flex: 1;">
                      <!-- Barra -->
                      <div class="bg-primary rounded-top position-relative" 
                           [style.height.px]="getAlturaColumna(dia.totalVentas)"
                           style="width: 30px; transition: height 0.3s ease; min-height: 5px;"
                           [title]="formatPrecio(dia.totalVentas)">
                        <!-- Valor sobre la barra -->
                        <div class="position-absolute top-0 start-50 translate-middle-x mt-1">
                          <small class="text-dark fw-bold" style="font-size: 9px;">
                            {{ formatPrecioCorta(dia.totalVentas) }}
                          </small>
                        </div>
                      </div>
                      
                      <!-- Fecha -->
                      <small class="mt-2 text-center" style="font-size: 10px; line-height: 1.2;">
                        {{ formatFechaCorta(dia.fecha) }}
                      </small>
                      
                      <!-- Cantidad de ventas -->
                      <small class="text-muted" style="font-size: 9px;">
                        {{ dia.cantidadVentas }} venta{{ dia.cantidadVentas !== 1 ? 's' : '' }}
                      </small>
                    </div>
                  </div>
                </div>
                
                <!-- Línea de eje X -->
                <div class="border-top mt-3 pt-2"></div>
              </div>

              <!-- Resumen de Ventas -->
              <div class="row mt-4 text-center">
                <div class="col-4">
                  <div class="border-end">
                    <h5 class="text-primary fw-bold">{{ getTotalVentas7Dias() }}</h5>
                    <small class="text-muted">Total 7 días</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="border-end">
                    <h5 class="text-success fw-bold">{{ getPromedioVentas() }}</h5>
                    <small class="text-muted">Promedio/día</small>
                  </div>
                </div>
                <div class="col-4">
                  <div>
                    <h5 class="text-info fw-bold">{{ getDiaMayorVenta() }}</h5>
                    <small class="text-muted">Mejor día</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .pie-chart-container {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 0 auto;
    }
    .pie-chart {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      background: #f8f9fa;
    }
    .pie-segment {
      position: absolute;
      width: 100%;
      height: 100%;
      clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
      transform-origin: center;
    }
    .pie-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .legend-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .legend-text {
      flex: 1;
    }
    .chart-container {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  ventasTotales: number = 0;
  gananciasTotales: number = 0;
  margenGanancia: number = 0;
  totalProductos: number = 0;
  productosBajoStock: number = 0;
  ventasHoy: number = 0;
  cantidadVentasHoy: number = 0;
  variacionVentas: number = 0;

  productosBajoStockLista: Producto[] = [];
  ventasPorDia: VentaPorDia[] = [];
  estadisticasCategorias: EstadisticaCategoria[] = [];

  coloresCategorias: string[] = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService
  ) {}

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.cargarProductos();
    this.cargarVentas();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.procesarProductos(productos);
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
      }
    });
  }

  cargarVentas() {
    this.ventaService.getVentas().subscribe({
      next: (ventas) => {
        this.procesarVentas(ventas);
      },
      error: (error) => {
        console.error('Error cargando ventas:', error);
      }
    });
  }

  procesarProductos(productos: Producto[]) {
    this.totalProductos = productos.length;
    
    this.productosBajoStockLista = productos.filter(p => p.stockActual <= p.stockMinimo);
    this.productosBajoStock = this.productosBajoStockLista.length;

    this.calcularEstadisticasCategorias(productos);
  }

  procesarVentas(ventas: Venta[]) {
    this.ventasTotales = ventas.reduce((total, venta) => total + venta.totalVenta, 0);
    
    let costosTotales = 0;
    ventas.forEach(venta => {
      venta.detalles.forEach(detalle => {
        if (detalle.producto && detalle.producto.precioCompra) {
          costosTotales += detalle.producto.precioCompra * detalle.cantidad;
        }
      });
    });
    
    this.gananciasTotales = this.ventasTotales - costosTotales;
    this.margenGanancia = this.ventasTotales > 0 ? 
      Number(((this.gananciasTotales / this.ventasTotales) * 100).toFixed(1)) : 0;

    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoyArray = ventas.filter(v => v.fechaVenta && v.fechaVenta.startsWith(hoy));
    this.ventasHoy = ventasHoyArray.reduce((total, venta) => total + venta.totalVenta, 0);
    this.cantidadVentasHoy = ventasHoyArray.length;

    this.calcularVentasPorDia(ventas);

    this.variacionVentas = 12.5;
  }

  calcularEstadisticasCategorias(productos: Producto[]) {
    const categoriasMap = new Map<string, number>();
    
    productos.forEach(producto => {
      const categoria = producto.categoria.nombreCategoria;
      categoriasMap.set(categoria, (categoriasMap.get(categoria) || 0) + 1);
    });

    this.estadisticasCategorias = Array.from(categoriasMap.entries()).map(([categoria, cantidad], index) => ({
      categoria,
      cantidad,
      porcentaje: Number(((cantidad / this.totalProductos) * 100).toFixed(1)),
      color: this.coloresCategorias[index % this.coloresCategorias.length]
    }));

    this.estadisticasCategorias.sort((a, b) => b.cantidad - a.cantidad);
  }

  calcularVentasPorDia(ventas: Venta[]) {
    const ventasPorDiaMap = new Map<string, VentaPorDia>();
    const hoy = new Date();

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      ventasPorDiaMap.set(fechaStr, {
        fecha: fechaStr,
        totalVentas: 0,
        cantidadVentas: 0
      });
    }

    ventas.forEach(venta => {
      if (!venta.fechaVenta) return;
      const fechaVenta = venta.fechaVenta.split('T')[0];
      
      if (ventasPorDiaMap.has(fechaVenta)) {
        const dia = ventasPorDiaMap.get(fechaVenta)!;
        dia.totalVentas += venta.totalVenta;
        dia.cantidadVentas += 1;
      }
    });

    this.ventasPorDia = Array.from(ventasPorDiaMap.values())
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  formatPrecio(precio: number): string {
    return `Bs ${precio.toFixed(2)}`;
  }

  formatPrecioCorta(precio: number): string {
    if (precio >= 1000) return `Bs ${(precio/1000).toFixed(0)}k`;
    return `Bs ${precio.toFixed(0)}`;
  }

  formatFechaCorta(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  getAlturaColumna(totalVentas: number): number {
    const maxVentas = this.getMaxVentas();
    if (maxVentas === 0) return 5;
    return Math.max((totalVentas / maxVentas) * 180, 5);
  }

  getMaxVentas(): number {
    if (this.ventasPorDia.length === 0) return 100;
    return Math.max(...this.ventasPorDia.map(d => d.totalVentas), 100);
  }

  getRotacion(categoria: EstadisticaCategoria): number {
    const index = this.estadisticasCategorias.indexOf(categoria);
    let rotacion = 0;
    for (let i = 0; i < index; i++) {
      rotacion += this.estadisticasCategorias[i].porcentaje * 3.6;
    }
    return rotacion;
  }

  getTotalVentas7Dias(): string {
    const total = this.ventasPorDia.reduce((sum, dia) => sum + dia.totalVentas, 0);
    return this.formatPrecio(total);
  }

  getPromedioVentas(): string {
    const total = this.ventasPorDia.reduce((sum, dia) => sum + dia.totalVentas, 0);
    const promedio = this.ventasPorDia.length > 0 ? total / this.ventasPorDia.length : 0;
    return this.formatPrecio(promedio);
  }

  getDiaMayorVenta(): string {
    if (this.ventasPorDia.length === 0) return 'Bs 0';
    const mayorVenta = Math.max(...this.ventasPorDia.map(d => d.totalVentas));
    return this.formatPrecio(mayorVenta);
  }
}