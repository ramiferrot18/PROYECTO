import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto, Categoria } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { VentaService, Venta, DetalleVenta } from '../../services/venta.service';

interface ItemVenta {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  importe: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-success text-white">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0">💰 Módulo de Ventas</h4>
          <button class="btn btn-light btn-sm" (click)="mostrarNuevaVenta()">
            ➕ Nueva Venta
          </button>
        </div>
      </div>
      <div class="card-body">

        <!-- FORMULARIO DE NUEVA VENTA -->
        <div *ngIf="mostrarFormularioVenta" class="card mb-4 border-primary">
          <div class="card-header bg-primary text-white">
            <h6 class="mb-0">🛒 Nueva Venta</h6>
          </div>
          <div class="card-body">
            
            <!-- Búsqueda de Productos -->
            <div class="row mb-4">
              <div class="col-md-8">
                <div class="input-group">
                  <span class="input-group-text">🔍</span>
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Buscar producto por nombre..."
                    [(ngModel)]="terminoBusquedaProducto"
                    (input)="filtrarProductos()">
                </div>
              </div>
              <div class="col-md-4">
                <select class="form-select" [(ngModel)]="categoriaFiltro" (change)="filtrarProductos()">
                  <option value="">Todas las categorías</option>
                  <option *ngFor="let cat of categorias" [value]="cat.idCategoria">
                    {{ cat.nombreCategoria }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Lista de Productos Disponibles -->
            <div *ngIf="productosFiltrados.length > 0" class="mb-4">
              <h6>Productos Disponibles:</h6>
              <div class="row">
                <div *ngFor="let producto of productosFiltrados" class="col-md-4 mb-2">
                  <div class="card product-card" (click)="agregarProductoCarrito(producto)">
                    <div class="card-body p-2">
                      <h6 class="card-title mb-1">{{ producto.nombreProducto }}</h6>
                      <p class="card-text mb-1 small text-muted">
                        {{ producto.categoria.nombreCategoria || 'Sin categoría' }}
                      </p>
                      <p class="card-text mb-1">
                        <strong class="text-success">{{ formatPrecio(producto.precioVenta) }}</strong>
                        <small class="text-muted">Stock: {{ producto.stockActual }}</small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Carrito de Compra -->
            <div *ngIf="carrito.length > 0" class="mb-4">
              <h6>🛒 Carrito de Compra</h6>
              <div class="table-responsive">
                <table class="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th width="100">Cantidad</th>
                      <th width="100">Precio</th>
                      <th width="100">Importe</th>
                      <th width="80">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of carrito; let i = index">
                      <td>{{ item.producto.nombreProducto }}</td>
                      <td>
                        <div class="input-group input-group-sm">
                          <button class="btn btn-outline-secondary" 
                                  (click)="modificarCantidad(i, -1)"
                                  [disabled]="item.cantidad <= 1">-</button>
                          <input type="number" 
                                 class="form-control text-center" 
                                 [(ngModel)]="item.cantidad"
                                 (change)="actualizarImporte(i)"
                                 min="1"
                                 [max]="item.producto.stockActual">
                          <button class="btn btn-outline-secondary" 
                                  (click)="modificarCantidad(i, 1)"
                                  [disabled]="item.cantidad >= item.producto.stockActual">+</button>
                        </div>
                      </td>
                      <td>{{ formatPrecio(item.precioUnitario) }}</td>
                      <td>{{ formatPrecio(item.importe) }}</td>
                      <td>
                        <button class="btn btn-danger btn-sm" 
                                (click)="eliminarDelCarrito(i)">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Totales -->
              <div class="row">
                <div class="col-md-6">
                  <div class="alert alert-info">
                    <strong>Total: {{ formatPrecio(calcularTotal()) }}</strong>
                  </div>
                </div>
                <div class="col-md-6">
                  <!-- Método de Pago -->
                  <div class="mb-3">
                    <label class="form-label">Método de Pago *</label>
                    <select class="form-select" [(ngModel)]="ventaActual.metodoPago" required>
                      <option value="">Seleccionar método</option>
                      <option value="EFECTIVO">💵 Efectivo</option>
                      <option value="TARJETA">💳 Tarjeta</option>
                      <option value="MIXTO">💰 Mixto</option>
                    </select>
                  </div>

                  <!-- Campos de pago según método -->
                  <div *ngIf="ventaActual.metodoPago === 'EFECTIVO' || ventaActual.metodoPago === 'MIXTO'" class="mb-3">
                    <label class="form-label">Pago en Efectivo</label>
                    <input type="number" 
                           class="form-control" 
                           [(ngModel)]="ventaActual.pagoEfectivo"
                           (input)="calcularCambio()"
                           step="0.01"
                           min="0">
                  </div>

                  <div *ngIf="ventaActual.metodoPago === 'TARJETA' || ventaActual.metodoPago === 'MIXTO'" class="mb-3">
                    <label class="form-label">Pago con Tarjeta</label>
                    <input type="number" 
                           class="form-control" 
                           [(ngModel)]="ventaActual.pagoTarjeta"
                           step="0.01"
                           min="0">
                  </div>

                  <div *ngIf="ventaActual.cambio !== undefined && ventaActual.cambio > 0" class="alert alert-warning">
                    <strong>Cambio: {{ formatPrecio(ventaActual.cambio || 0) }}</strong>
                  </div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="d-flex gap-2">
                <button class="btn btn-success" 
                        (click)="procesarVenta()"
                        [disabled]="!validarVenta()">
                  ✅ Finalizar Venta
                </button>
                <button class="btn btn-secondary" (click)="cancelarVenta()">
                  ❌ Cancelar
                </button>
                <button class="btn btn-outline-danger" (click)="limpiarCarrito()">
                  🗑️ Vaciar Carrito
                </button>
              </div>
            </div>

            <!-- Mensaje carrito vacío -->
            <div *ngIf="carrito.length === 0" class="text-center py-4">
              <p class="text-muted">El carrito está vacío. Busca productos y haz clic en ellos para agregarlos.</p>
            </div>

          </div>
        </div>

        <!-- HISTORIAL DE VENTAS -->
        <div class="card">
          <div class="card-header bg-info text-white">
            <h6 class="mb-0">📋 Historial de Ventas</h6>
          </div>
          <div class="card-body">
            
            <!-- Filtros de historial -->
            <div class="row mb-3">
              <div class="col-md-4">
                <input type="date" class="form-control" [(ngModel)]="fechaFiltro" (change)="cargarVentas()">
              </div>
              <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" (click)="cargarVentas()">
                  🔄 Actualizar
                </button>
              </div>
              <div class="col-md-4 text-end">
                <span class="badge bg-success">Total: {{ formatPrecio(calcularTotalVentas()) }}</span>
              </div>
            </div>

            <!-- Tabla de ventas -->
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Folio</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Productos</th>
                    <th>Método Pago</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let venta of ventas">
                    <td>
                      <strong>#{{ venta.folioVenta || venta.idVenta }}</strong>
                    </td>
                    <td>
                      {{ formatFecha(venta.fechaVenta) }}
                    </td>
                    <td>
                      {{ formatHora(venta.fechaVenta) }}
                    </td>
                    <td>
                      <div *ngIf="venta.detalles && venta.detalles.length > 0">
                        <div *ngFor="let detalle of venta.detalles" class="mb-1">
                          <small>
                            <strong>{{ detalle.cantidad }}x</strong> 
                            {{ getNombreProducto(detalle) }}
                            <span class="text-muted">({{ formatPrecio(detalle.precioUnitario) }})</span>
                          </small>
                        </div>
                      </div>
                      <div *ngIf="!venta.detalles || venta.detalles.length === 0">
                        <small class="text-muted">Cargando productos...</small>
                      </div>
                    </td>
                    <td>
                      <span [class]="getBadgeClass(venta.metodoPago || 'EFECTIVO')">
                        {{ getMetodoPagoTexto(venta.metodoPago || 'EFECTIVO') }}
                      </span>
                    </td>
                    <td>
                      <strong class="text-success">{{ formatPrecio(venta.totalVenta) }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mensaje sin ventas -->
            <div *ngIf="ventas.length === 0 && !cargando" class="text-center py-4">
              <p class="text-muted">No hay ventas registradas.</p>
            </div>

            <!-- Loading -->
            <div *ngIf="cargando" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-2">Cargando ventas...</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .product-card {
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .badge {
      padding: 0.35em 0.65em;
      font-size: 0.75em;
      font-weight: 500;
      border-radius: 0.375rem;
    }
    .badge-efectivo { 
      background-color: #28a745 !important; 
      color: white !important;
    }
    .badge-tarjeta { 
      background-color: #007bff !important; 
      color: white !important;
    }
    .badge-mixto { 
      background-color: #6f42c1 !important; 
      color: white !important;
    }
  `]
})
export class VentasComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  carrito: ItemVenta[] = [];
  ventaActual: Venta = this.nuevaVentaVacia();
  ventas: Venta[] = [];
  terminoBusquedaProducto: string = '';
  categoriaFiltro: string = '';
  fechaFiltro: string = this.getFechaHoy();
  mostrarFormularioVenta: boolean = false;
  cargando: boolean = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private ventaService: VentaService
  ) {}

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.cargando = true;
    
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        
        this.productoService.getProductos().subscribe({
          next: (productos) => {
            this.productos = productos;
            this.productosFiltrados = [...productos];
            this.cargarVentas();
          },
          error: (error) => {
            console.error('Error cargando productos:', error);
            this.cargando = false;
          }
        });
      },
      error: (error) => {
        console.error('Error cargando categorías:', error);
        this.cargando = false;
      }
    });
  }

  cargarVentas() {
    this.cargando = true;
    
    this.ventaService.getVentas().subscribe({
      next: (ventas) => {
        this.ventas = ventas.map((venta) => {
          const metodoPago = venta.metodoPago || 'EFECTIVO';
          
          let detalles: DetalleVenta[] = [];
          
          if (venta.detalles && Array.isArray(venta.detalles)) {
            detalles = venta.detalles.map((detalle: any) => ({
              idDetalle: detalle.idDetalle,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.precioUnitario,
              importeTotal: detalle.importeTotal,
              producto: detalle.producto || { 
                nombreProducto: 'Producto no disponible',
                categoria: { nombreCategoria: 'Sin categoría' },
                precioCompra: 0,
                precioVenta: 0,
                stockActual: 0,
                stockMinimo: 0
              }
            }));
          }
          
          return {
            ...venta,
            metodoPago: metodoPago,
            detalles: detalles
          };
        });
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando ventas:', error);
        this.cargando = false;
      }
    });
  }

  filtrarProductos() {
    this.productosFiltrados = this.productos.filter(producto => {
      const coincideNombre = producto.nombreProducto.toLowerCase()
        .includes(this.terminoBusquedaProducto.toLowerCase());
      
      const coincideCategoria = !this.categoriaFiltro || 
        producto.categoria.idCategoria?.toString() === this.categoriaFiltro;
      
      return coincideNombre && coincideCategoria && producto.stockActual > 0;
    });
  }

  agregarProductoCarrito(producto: Producto) {
    const itemExistente = this.carrito.find(item => 
      item.producto.idProducto === producto.idProducto
    );

    if (itemExistente) {
      if (itemExistente.cantidad < producto.stockActual) {
        itemExistente.cantidad++;
        itemExistente.importe = itemExistente.cantidad * itemExistente.precioUnitario;
      }
    } else {
      this.carrito.push({
        producto: producto,
        cantidad: 1,
        precioUnitario: producto.precioVenta,
        importe: producto.precioVenta
      });
    }
  }

  modificarCantidad(index: number, cambio: number) {
    const item = this.carrito[index];
    const nuevaCantidad = item.cantidad + cambio;
    const stockMaximo = item.producto.stockActual;
    
    if (nuevaCantidad >= 1 && nuevaCantidad <= stockMaximo) {
      item.cantidad = nuevaCantidad;
      item.importe = item.cantidad * item.precioUnitario;
    }
  }

  actualizarImporte(index: number) {
    const item = this.carrito[index];
    if (item.cantidad < 1) item.cantidad = 1;
    const stockMaximo = item.producto.stockActual;
    if (item.cantidad > stockMaximo) {
      item.cantidad = stockMaximo;
    }
    item.importe = item.cantidad * item.precioUnitario;
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  limpiarCarrito() {
    this.carrito = [];
    this.ventaActual = this.nuevaVentaVacia();
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + item.importe, 0);
  }

  calcularCambio() {
    const total = this.calcularTotal();
    const pagoEfectivo = this.ventaActual.pagoEfectivo || 0;
    this.ventaActual.cambio = pagoEfectivo - total;
    if (this.ventaActual.cambio < 0) this.ventaActual.cambio = 0;
  }

  calcularTotalVentas(): number {
    return this.ventas.reduce((total, venta) => total + venta.totalVenta, 0);
  }

  validarVenta(): boolean {
    return this.carrito.length > 0 && 
           !!this.ventaActual.metodoPago &&
           this.calcularTotal() > 0;
  }

  procesarVenta() {
    if (!this.validarVenta()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const ventaData: Venta = {
      totalVenta: this.calcularTotal(),
      metodoPago: this.ventaActual.metodoPago!,
      pagoEfectivo: this.ventaActual.pagoEfectivo || 0,
      pagoTarjeta: this.ventaActual.pagoTarjeta || 0,
      cambio: this.ventaActual.cambio || 0,
      usuario: 'CAJERO',
      detalles: this.carrito.map(item => ({
        producto: item.producto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        importeTotal: item.importe
      }))
    };

    this.ventaService.createVenta(ventaData).subscribe({
      next: (venta) => {
        alert('✅ Venta procesada correctamente!');
        this.limpiarCarrito();
        this.mostrarFormularioVenta = false;
        this.cargarVentas();
        this.cargarDatosIniciales();
      },
      error: (error) => {
        console.error('Error procesando venta:', error);
        alert('Error procesando venta: ' + (error.error?.message || error.message));
      }
    });
  }

  nuevaVentaVacia(): Venta {
    return {
      totalVenta: 0,
      metodoPago: '',
      detalles: []
    };
  }

  formatPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }

  formatFecha(fecha: string | undefined): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX');
  }

  formatHora(fecha: string | undefined): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getFechaHoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMetodoPagoTexto(metodo: string): string {
    switch(metodo) {
      case 'EFECTIVO': return '💵 Efectivo';
      case 'TARJETA': return '💳 Tarjeta';
      case 'MIXTO': return '💰 Mixto';
      default: return metodo;
    }
  }

  getBadgeClass(metodo: string): string {
    switch(metodo) {
      case 'EFECTIVO': return 'badge badge-efectivo';
      case 'TARJETA': return 'badge badge-tarjeta';
      case 'MIXTO': return 'badge badge-mixto';
      default: return 'badge bg-secondary';
    }
  }

  getNombreProducto(detalle: DetalleVenta): string {
    if (detalle.producto && detalle.producto.nombreProducto) {
      return detalle.producto.nombreProducto;
    }
    return 'Producto no disponible';
  }

  mostrarNuevaVenta() {
    this.mostrarFormularioVenta = true;
    this.limpiarCarrito();
  }

  cancelarVenta() {
    if (confirm('¿Estás seguro de cancelar esta venta?')) {
      this.mostrarFormularioVenta = false;
      this.limpiarCarrito();
    }
  }
}