import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Categoria {
  idCategoria?: number;
  nombreCategoria: string;
  descripcion?: string;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header" [class.bg-success]="conectado" [class.bg-danger]="!conectado">
        <h4 class="mb-0 text-white">
          {{ conectado ? '✅ GESTIÓN DE CATEGORÍAS' : '❌ PROBLEMA DE CONEXIÓN' }}
        </h4>
      </div>
      <div class="card-body">
        
        <!-- Mensaje de estado -->
        <div *ngIf="!conectado" class="alert alert-warning">
          <h5>⚠️ No se puede conectar al backend</h5>
          <button class="btn btn-primary" (click)="probarBackend()">
            🔄 Reintentar Conexión
          </button>
        </div>

        <!-- Contenido cuando está conectado -->
        <div *ngIf="conectado">
          
          <!-- Botones principales -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5>📋 Lista de Categorías ({{ categorias.length }})</h5>
            <div>
              <button class="btn btn-primary me-2" (click)="cargarCategorias()">
                🔄 Actualizar
              </button>
              <button class="btn btn-success" (click)="mostrarFormularioNuevo()">
                ➕ Nueva Categoría
              </button>
            </div>
          </div>

          <!-- FORMULARIO DE CREACIÓN/EDICIÓN -->
          <div *ngIf="mostrarFormulario" class="card mb-4 border-primary">
            <div class="card-header bg-primary text-white">
              <h6 class="mb-0">
                {{ categoriaEdit.idCategoria ? '✏️ EDITAR CATEGORÍA' : '➕ NUEVA CATEGORÍA' }}
              </h6>
            </div>
            <div class="card-body">
              <form (ngSubmit)="guardarCategoria()">
                <div class="mb-3">
                  <label class="form-label">Nombre de la Categoría *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="categoriaEdit.nombreCategoria"
                    name="nombreCategoria"
                    required
                    placeholder="Ej: Abarrotes, Lácteos, Bebidas..."
                    style="font-size: 16px; padding: 10px;">
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Descripción (opcional)</label>
                  <textarea 
                    class="form-control" 
                    [(ngModel)]="categoriaEdit.descripcion"
                    name="descripcion"
                    rows="3"
                    placeholder="Describe brevemente esta categoría..."
                    style="font-size: 16px; padding: 10px;"></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-success" [disabled]="!categoriaEdit.nombreCategoria.trim()">
                    💾 {{ categoriaEdit.idCategoria ? 'Actualizar' : 'Guardar' }}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelarEdicion()">
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Lista de categorías -->
          <div *ngIf="categorias.length > 0" class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cat of categorias">
                  <td><strong>#{{ cat.idCategoria }}</strong></td>
                  <td>{{ cat.nombreCategoria }}</td>
                  <td>{{ cat.descripcion || 'Sin descripción' }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-warning me-1" 
                              (click)="editarCategoria(cat)"
                              title="Editar categoría">
                        ✏️ Editar
                      </button>
                      <button class="btn btn-danger" 
                              (click)="eliminarCategoria(cat.idCategoria!)"
                              title="Eliminar categoría">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mensaje si no hay categorías -->
          <div *ngIf="categorias.length === 0 && !mostrarFormulario" class="text-center py-4">
            <p class="text-muted">No hay categorías registradas.</p>
            <button class="btn btn-success me-2" (click)="mostrarFormularioNuevo()">
              ➕ Crear Primera Categoría
            </button>
            <button class="btn btn-outline-primary" (click)="crearDatosPrueba()">
              🎯 Crear Datos de Prueba
            </button>
          </div>

        </div>

        <!-- Loading -->
        <div *ngIf="cargando" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Conectando con el backend...</p>
        </div>

      </div>
    </div>
  `
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriaEdit: Categoria = { nombreCategoria: '', descripcion: '' };
  mostrarFormulario = false;
  conectado = false;
  cargando = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.probarBackend();
  }

  probarBackend() {
    this.cargando = true;
    
    this.http.get('http://localhost:8080/api/categorias', { 
      observe: 'response' 
    }).subscribe({
      next: (response: any) => {
        this.conectado = true;
        this.cargando = false;
        this.categorias = response.body || [];
      },
      error: (error) => {
        this.conectado = false;
        this.cargando = false;
      }
    });
  }

  cargarCategorias() {
    this.http.get('http://localhost:8080/api/categorias').subscribe({
      next: (data: any) => {
        this.categorias = data;
      }
    });
  }

  mostrarFormularioNuevo() {
    this.categoriaEdit = { nombreCategoria: '', descripcion: '' };
    this.mostrarFormulario = true;
  }

  guardarCategoria() {
    if (!this.categoriaEdit.nombreCategoria.trim()) {
      alert('❌ El nombre de la categoría es obligatorio');
      return;
    }

    if (this.categoriaEdit.idCategoria) {
      // EDITAR categoría existente
      this.http.put(`http://localhost:8080/api/categorias/${this.categoriaEdit.idCategoria}`, this.categoriaEdit)
        .subscribe({
          next: (categoria: any) => {
            // Actualizar en la lista
            const index = this.categorias.findIndex(c => c.idCategoria === categoria.idCategoria);
            if (index !== -1) {
              this.categorias[index] = categoria;
            }
            this.mostrarFormulario = false;
            alert('✅ Categoría actualizada correctamente');
          },
          error: (error) => {
            alert('❌ Error actualizando categoría: ' + error.message);
          }
        });
    } else {
      // CREAR nueva categoría
      this.http.post('http://localhost:8080/api/categorias', this.categoriaEdit)
        .subscribe({
          next: (categoria: any) => {
            this.categorias.push(categoria);
            this.mostrarFormulario = false;
            alert('✅ Categoría creada correctamente: ' + categoria.nombreCategoria);
          },
          error: (error) => {
            alert('❌ Error creando categoría: ' + error.message);
          }
        });
    }
  }

  editarCategoria(categoria: Categoria) {
    this.categoriaEdit = { ...categoria }; // Copiar la categoría
    this.mostrarFormulario = true;
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.http.delete(`http://localhost:8080/api/categorias/${id}`)
        .subscribe({
          next: () => {
            this.categorias = this.categorias.filter(c => c.idCategoria !== id);
            alert('✅ Categoría eliminada correctamente');
          },
          error: (error) => {
            alert('❌ Error eliminando categoría: ' + error.message);
          }
        });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
    this.categoriaEdit = { nombreCategoria: '', descripcion: '' };
  }

  crearDatosPrueba() {
    const categoriasPrueba = [
      { nombreCategoria: 'Abarrotes', descripcion: 'Productos básicos de despensa' },
      { nombreCategoria: 'Lácteos', descripcion: 'Leche, queso, yogur, huevos' },
      { nombreCategoria: 'Bebidas', descripcion: 'Refrescos, jugos, aguas' }
    ];

    let creadas = 0;
    let errores = 0;
    
    categoriasPrueba.forEach(cat => {
      this.http.post('http://localhost:8080/api/categorias', cat)
        .subscribe({
          next: (categoria: any) => {
            this.categorias.push(categoria);
            creadas++;
            
            if (creadas + errores === categoriasPrueba.length) {
              if (errores === 0) {
                alert(`✅ Se crearon ${creadas} categorías de prueba`);
              } else {
                alert(`✅ Se crearon ${creadas} categorías, ${errores} con error`);
              }
            }
          },
          error: (error) => {
            errores++;
            console.error('Error creando categoría:', cat.nombreCategoria, error);
          }
        });
    });
  }
}