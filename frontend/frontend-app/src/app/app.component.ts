import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
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
                <a href="#" class="nav-link active" aria-current="page">
                  📊 Dashboard
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  📦 Productos
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  🏷️ Categorías
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  🚚 Proveedores
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  💰 Ventas
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  📥 Compras
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  📈 Reportes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 ml-sm-auto px-4 py-4">
          <!-- Cards de Estadísticas -->
          <div class="row">
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
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Bienvenido al Sistema</h6>
            </div>
            <div class="card-body">
              <div class="alert alert-success">
                <strong>✅ ¡Sistema Listo!</strong> El frontend y backend están funcionando correctamente.
              </div>
              
              <p>Tu sistema de control de inventarios para microempresas de abarrotes está listo para usar.</p>
              
              <div class="mt-4">
                <button class="btn btn-primary me-2" (click)="mostrarMensaje()">
                  🎯 Probar Sistema
                </button>
                <button class="btn btn-outline-success">
                  📦 Gestionar Productos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-dark {
      background-color: #2c3e50 !important;
    }
    .border-left-primary {
      border-left: 0.25rem solid #4e73df !important;
    }
    .border-left-success {
      border-left: 0.25rem solid #1cc88a !important;
    }
    .border-left-warning {
      border-left: 0.25rem solid #f6c23e !important;
    }
    .border-left-info {
      border-left: 0.25rem solid #36b9cc !important;
    }
    .shadow {
      box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important;
    }
    .nav-link.active {
      background-color: #3498db !important;
    }
  `]
})
export class AppComponent {
  
  mostrarMensaje() {
    alert('🎉 ¡Sistema funcionando perfectamente!\n\n✅ Backend: Spring Boot\n✅ Base de datos: PostgreSQL\n✅ Frontend: Angular\n\n¡Ahora podemos crear los módulos específicos!');
  }
}