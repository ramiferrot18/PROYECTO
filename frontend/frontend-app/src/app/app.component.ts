import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CategoriasComponent } from './components/categorias/categorias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CategoriasComponent],
  template: `
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">
          🏪 Mi Tienda de Abarrotes
        </a>
        <div class="navbar-nav ms-auto">
          <span class="navbar-text text-light">
            Sistema de Inventarios
          </span>
        </div>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-dark text-white vh-100">
          <div class="d-flex flex-column flex-shrink-0 p-3">
            <ul class="nav nav-pills flex-column mb-auto">
              <li class="nav-item">
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'dashboard'"
                   [class.active]="seccionActiva === 'dashboard'">
                  📊 Dashboard
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'productos'"
                   [class.active]="seccionActiva === 'productos'">
                  📦 Productos
                </a>
              </li>
              <li>
                <a href="#" class="nav-link active" (click)="seccionActiva = 'categorias'"
                   [class.active]="seccionActiva === 'categorias'">
                  🏷️ Categorías
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'proveedores'"
                   [class.active]="seccionActiva === 'proveedores'">
                  🚚 Proveedores
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'ventas'"
                   [class.active]="seccionActiva === 'ventas'">
                  💰 Ventas
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 ml-sm-auto px-4 py-4">
          
          <!-- Dashboard -->
          <div *ngIf="seccionActiva === 'dashboard'">
            <!-- Cards de Estadísticas -->
            <div class="row mb-4">
              <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Productos
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">0</div>
                      </div>
                      <div class="col-auto">
                        <i class="fas fa-boxes fa-2x text-gray-300">📦</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Categorías
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">0</div>
                      </div>
                      <div class="col-auto">
                        <i class="fas fa-tags fa-2x text-gray-300">🏷️</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-warning shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Proveedores
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">0</div>
                      </div>
                      <div class="col-auto">
                        <i class="fas fa-truck fa-2x text-gray-300">🚚</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-info shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                          Stock Bajo
                        </div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">0</div>
                      </div>
                      <div class="col-auto">
                        <i class="fas fa-exclamation-triangle fa-2x text-gray-300">⚠️</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje de Bienvenida -->
            <div class="card shadow">
              <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Bienvenido al Sistema</h6>
              </div>
              <div class="card-body">
                <div class="alert alert-success">
                  <strong>✅ ¡Sistema Listo!</strong> El frontend y backend están funcionando correctamente.
                </div>
                
                <p>Selecciona una opción del menú lateral para comenzar.</p>
                
                <div class="mt-4">
                  <button class="btn btn-primary me-2" (click)="seccionActiva = 'categorias'">
                    🏷️ Gestionar Categorías
                  </button>
                  <button class="btn btn-outline-success" (click)="seccionActiva = 'productos'">
                    📦 Gestionar Productos
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de Categorías -->
          <div *ngIf="seccionActiva === 'categorias'">
            <app-categorias></app-categorias>
          </div>

          <!-- Otras secciones (próximamente) -->
          <div *ngIf="seccionActiva === 'productos'" class="text-center py-5">
            <h4>📦 Módulo de Productos</h4>
            <p class="text-muted">Próximamente...</p>
          </div>

          <div *ngIf="seccionActiva === 'proveedores'" class="text-center py-5">
            <h4>🚚 Módulo de Proveedores</h4>
            <p class="text-muted">Próximamente...</p>
          </div>

          <div *ngIf="seccionActiva === 'ventas'" class="text-center py-5">
            <h4>💰 Módulo de Ventas</h4>
            <p class="text-muted">Próximamente...</p>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-dark {
      background-color: #2c3e50 !important;
    }
    .border-left-primary { border-left: 0.25rem solid #4e73df !important; }
    .border-left-success { border-left: 0.25rem solid #1cc88a !important; }
    .border-left-warning { border-left: 0.25rem solid #f6c23e !important; }
    .border-left-info { border-left: 0.25rem solid #36b9cc !important; }
    .shadow { box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important; }
    .nav-link.active { background-color: #3498db !important; }
    .nav-link { cursor: pointer; }
  `]
})
export class AppComponent {
  seccionActiva = 'categorias'; // Empezar en categorías
}