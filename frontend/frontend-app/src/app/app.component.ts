import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CategoriasComponent, CatalogoComponent],
  template: `
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">
          Mi Tienda de Abarrotes
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
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'catalogo'"
                   [class.active]="seccionActiva === 'catalogo'">
                  Catalogo
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'categorias'"
                   [class.active]="seccionActiva === 'categorias'">
                  Categorias
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'proveedores'"
                   [class.active]="seccionActiva === 'proveedores'">
                  Proveedores
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'ventas'"
                   [class.active]="seccionActiva === 'ventas'">
                  Ventas
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 ml-sm-auto px-4 py-4">
          
          <!-- Dashboard -->
          <div *ngIf="seccionActiva === 'dashboard'">
            <div class="card">
              <div class="card-header">
                <h4>Bienvenido al Sistema</h4>
              </div>
              <div class="card-body">
                <p>Selecciona una opcion del menu lateral para comenzar.</p>
                <button class="btn btn-primary me-2" (click)="seccionActiva = 'catalogo'">
                  Gestionar Catalogo
                </button>
                <button class="btn btn-outline-success" (click)="seccionActiva = 'categorias'">
                  Gestionar Categorias
                </button>
              </div>
            </div>
          </div>

          <!-- Catalogo de Productos -->
          <div *ngIf="seccionActiva === 'catalogo'">
            <app-catalogo></app-catalogo>
          </div>

          <!-- Categorias -->
          <div *ngIf="seccionActiva === 'categorias'">
            <app-categorias></app-categorias>
          </div>

          <!-- Otras secciones -->
          <div *ngIf="seccionActiva === 'proveedores'" class="text-center py-5">
            <h4>Modulo de Proveedores</h4>
            <p class="text-muted">Proximamente...</p>
          </div>

          <div *ngIf="seccionActiva === 'ventas'" class="text-center py-5">
            <h4>Modulo de Ventas</h4>
            <p class="text-muted">Proximamente...</p>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-dark {
      background-color: #2c3e50 !important;
    }
    .nav-link.active { 
      background-color: #3498db !important; 
    }
    .nav-link { 
      cursor: pointer; 
    }
  `]
})
export class AppComponent {
  seccionActiva = 'catalogo'; // Empezar en catalogo
}