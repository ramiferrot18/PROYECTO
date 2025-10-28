import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Categoria {
  idCategoria?: number;
  nombreCategoria: string;
  descripcion?: string;
}

interface Producto {
  idProducto?: number;
  nombreProducto: string;
  descripcion?: string;
  categoria: Categoria;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  codigoBarras?: string;
  unidadMedida?: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-info text-white">
        <h4 class="mb-0">Catálogo de Productos</h4>
      </div>
      <div class="card-body">
        
        <!-- BARRA DE BÚSQUEDA Y FILTROS -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">🔍</span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Buscar producto por nombre..."
                [(ngModel)]="terminoBusqueda"
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
          <div class="col-md-2">
            <button class="btn btn-success w-100" (click)="mostrarFormularioNuevo()">
              ➕ Agregar
            </button>
          </div>
        </div>

        <!-- FORMULARIO DE NUEVO PRODUCTO -->
        <div *ngIf="mostrarFormulario" class="card mb-4 border-primary">
          <div class="card-header bg-primary text-white">
            <h6 class="mb-0">
              {{ productoEdit.idProducto ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO' }}
            </h6>
          </div>
          <div class="card-body">
            <form (ngSubmit)="guardarProducto()">
              
              <div class="row">
                <!-- Nombre del Producto -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombre del Producto *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="productoEdit.nombreProducto"
                    name="nombreProducto"
                    required
                    placeholder="Ej: Arroz, Leche, Coca-Cola...">
                </div>

                <!-- Categoría -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">Categoría *</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="categoriaSeleccionadaId"
                    name="categoria"
                    required>
                    <option value="">Selecciona una categoría</option>
                    <option *ngFor="let cat of categorias" [value]="cat.idCategoria">
                      {{ cat.nombreCategoria }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row">
                <!-- Precio de Venta -->
                <div class="col-md-3 mb-3">
                  <label class="form-label">Precio de Venta *</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      [(ngModel)]="productoEdit.precioVenta"
                      name="precioVenta"
                      min="0.01"
                      step="0.01"
                      required
                      placeholder="0.00">
                  </div>
                </div>

                <!-- Costo de Compra -->
                <div class="col-md-3 mb-3">
                  <label class="form-label">Costo de Compra *</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      [(ngModel)]="productoEdit.precioCompra"
                      name="precioCompra"
                      min="0.01"
                      step="0.01"
                      required
                      placeholder="0.00">
                  </div>
                </div>

                <!-- Stock Actual -->
                <div class="col-md-3 mb-3">
                  <label class="form-label">Stock Actual *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="productoEdit.stockActual"
                    name="stockActual"
                    min="0"
                    required
                    placeholder="0">
                </div>

                <!-- Stock Mínimo -->
                <div class="col-md-3 mb-3">
                  <label class="form-label">Stock Mínimo</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="productoEdit.stockMinimo"
                    name="stockMinimo"
                    min="0"
                    value="5"
                    placeholder="5">
                </div>
              </div>

              <!-- Descripción -->
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea 
                  class="form-control" 
                  [(ngModel)]="productoEdit.descripcion"
                  name="descripcion"
                  rows="3"
                  placeholder="Descripción del producto..."></textarea>
              </div>

              <!-- Código de Barras -->
              <div class="mb-3">
                <label class="form-label">Código de Barras (opcional)</label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="productoEdit.codigoBarras"
                  name="codigoBarras"
                  placeholder="Código de barras del producto">
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success" 
                        [disabled]="!formularioValido()">
                  {{ productoEdit.idProducto ? 'Actualizar' : 'Guardar' }}
                </button>
                <button type="button" class="btn btn-secondary" (click)="cancelarEdicion()">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- TABLA DE PRODUCTOS -->
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio Venta</th>
                <th>Costo</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let producto of productosFiltrados">
                <td>
                  <strong>{{ producto.nombreProducto }}</strong>
                  <br>
                  <small class="text-muted">{{ producto.descripcion || 'Sin descripción' }}</small>
                </td>
                <td>{{ producto.categoria.nombreCategoria }}</td>
                <td>
                  <strong class="text-success">{{ formatPrecio(producto.precioVenta) }}</strong>
                </td>
                <td>
                  <span class="text-muted">{{ formatPrecio(producto.precioCompra) }}</span>
                </td>
                <td>
                  {{ producto.stockActual }}
                  <small class="text-muted d-block">Mín: {{ producto.stockMinimo }}</small>
                </td>
                <td>
                  <span *ngIf="producto.stockActual > producto.stockMinimo" 
                        class="badge bg-success">Disponible</span>
                  <span *ngIf="producto.stockActual <= producto.stockMinimo && producto.stockActual > 0" 
                        class="badge bg-warning">Stock Bajo</span>
                  <span *ngIf="producto.stockActual === 0" 
                        class="badge bg-danger">Agotado</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-warning me-1" 
                            (click)="editarProducto(producto)"
                            title="Editar producto">
                      Editar
                    </button>
                    <button class="btn btn-danger" 
                            (click)="eliminarProducto(producto.idProducto!)"
                            title="Eliminar producto">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mensaje si no hay productos -->
        <div *ngIf="productosFiltrados.length === 0 && !cargando" class="text-center py-4">
          <p class="text-muted">No hay productos que coincidan con la búsqueda.</p>
          <button *ngIf="productos.length === 0" class="btn btn-success" (click)="mostrarFormularioNuevo()">
            Crear Primer Producto
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="cargando" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando productos...</p>
        </div>

      </div>
    </div>
  `
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  productoEdit: Producto = this.nuevoProductoVacio();
  categoriaSeleccionadaId: string = ''; // Cambiado a string
  terminoBusqueda: string = '';
  categoriaFiltro: string = '';
  mostrarFormulario: boolean = false;
  cargando: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    
    // Cargar categorías primero
    this.http.get<Categoria[]>('http://localhost:8080/api/categorias').subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        console.log('Categorías cargadas:', categorias);
        
        // Luego cargar productos
        this.http.get<Producto[]>('http://localhost:8080/api/productos').subscribe({
          next: (productos) => {
            this.productos = productos;
            this.productosFiltrados = [...productos];
            this.cargando = false;
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

  nuevoProductoVacio(): Producto {
    return {
      nombreProducto: '',
      descripcion: '',
      categoria: { idCategoria: undefined, nombreCategoria: '' },
      precioCompra: 0,
      precioVenta: 0,
      stockActual: 0,
      stockMinimo: 5,
      codigoBarras: '',
      unidadMedida: 'PIEZA'
    };
  }

  // Método para formatear precios
  formatPrecio(precio: number): string {
    return precio.toFixed(2);
  }

  filtrarProductos() {
    this.productosFiltrados = this.productos.filter(producto => {
      const coincideNombre = producto.nombreProducto.toLowerCase()
        .includes(this.terminoBusqueda.toLowerCase());
      
      const coincideCategoria = !this.categoriaFiltro || 
        producto.categoria.idCategoria?.toString() === this.categoriaFiltro;
      
      return coincideNombre && coincideCategoria;
    });
  }

  mostrarFormularioNuevo() {
    this.productoEdit = this.nuevoProductoVacio();
    this.categoriaSeleccionadaId = '';
    this.mostrarFormulario = true;
  }

  formularioValido(): boolean {
    return !!this.productoEdit.nombreProducto?.trim() &&
           !!this.categoriaSeleccionadaId &&
           this.productoEdit.precioVenta > 0 &&
           this.productoEdit.precioCompra > 0 &&
           this.productoEdit.stockActual >= 0;
  }

  guardarProducto() {
  if (!this.formularioValido()) {
    alert('Por favor completa todos los campos obligatorios correctamente');
    return;
  }

  console.log('Categoría seleccionada ID:', this.categoriaSeleccionadaId, 'Tipo:', typeof this.categoriaSeleccionadaId);

  // Convertir a número y encontrar la categoría
  const categoriaId = Number(this.categoriaSeleccionadaId);
  const categoriaSeleccionada = this.categorias.find(
    cat => cat.idCategoria === categoriaId
  );
  
  if (!categoriaSeleccionada) {
    alert('Error: No se pudo encontrar la categoría seleccionada. ID: ' + categoriaId);
    return;
  }

  console.log('Categoría encontrada:', categoriaSeleccionada);

  // PREPARAR DATOS EXACTAMENTE COMO LOS ESPERA EL BACKEND
  const datosProducto = {
    nombreProducto: this.productoEdit.nombreProducto,
    descripcion: this.productoEdit.descripcion || null,
    categoria: {
      idCategoria: categoriaSeleccionada.idCategoria
    },
    precioCompra: this.productoEdit.precioCompra,
    precioVenta: this.productoEdit.precioVenta,
    stockActual: this.productoEdit.stockActual,
    stockMinimo: this.productoEdit.stockMinimo || 5,
    codigoBarras: this.productoEdit.codigoBarras || null,
    unidadMedida: 'PIEZA'
  };

  console.log('Datos a enviar al backend:', datosProducto);

  if (this.productoEdit.idProducto) {
    // EDITAR producto existente - ENVIAR SOLO LOS DATOS NECESARIOS
    this.http.put(`http://localhost:8080/api/productos/${this.productoEdit.idProducto}`, datosProducto)
      .subscribe({
        next: (producto: any) => {
          const index = this.productos.findIndex(p => p.idProducto === producto.idProducto);
          if (index !== -1) {
            this.productos[index] = producto;
          }
          this.filtrarProductos();
          this.mostrarFormulario = false;
          alert('Producto actualizado correctamente');
        },
        error: (error) => {
          console.error('Error completo:', error);
          alert('Error actualizando producto. Revisa la consola para más detalles.');
        }
      });
  } else {
    // CREAR nuevo producto
    this.http.post('http://localhost:8080/api/productos', datosProducto)
      .subscribe({
        next: (producto: any) => {
          this.productos.push(producto);
          this.filtrarProductos();
          this.mostrarFormulario = false;
          alert('Producto creado correctamente: ' + producto.nombreProducto);
        },
        error: (error) => {
          console.error('Error completo:', error);
          alert('Error creando producto. Revisa la consola para más detalles.');
        }
      });
    }
  }

  editarProducto(producto: Producto) {
    this.productoEdit = { ...producto };
    this.categoriaSeleccionadaId = producto.categoria.idCategoria?.toString() || '';
    this.mostrarFormulario = true;
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.http.delete(`http://localhost:8080/api/productos/${id}`)
        .subscribe({
          next: () => {
            this.productos = this.productos.filter(p => p.idProducto !== id);
            this.filtrarProductos();
            alert('Producto eliminado correctamente');
          },
          error: (error) => {
            alert('Error eliminando producto: ' + error.message);
          }
        });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.productoEdit = this.nuevoProductoVacio();
    this.categoriaSeleccionadaId = '';
  }
}