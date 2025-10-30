import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CategoriasComponent, 
    CatalogoComponent, 
    VentasComponent, 
    ReportesComponent,
    DashboardComponent
  ],
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
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'ventas'"
                  [class.active]="seccionActiva === 'ventas'">
                  Ventas
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white" (click)="seccionActiva = 'reportes'"
                  [class.active]="seccionActiva === 'reportes'">
                  Reportes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 ml-sm-auto px-4 py-4">
          
          <!-- Dashboard -->
          <div *ngIf="seccionActiva === 'dashboard'">
            <app-dashboard></app-dashboard>
          </div>

          <!-- Catalogo de Productos -->
          <div *ngIf="seccionActiva === 'catalogo'">
            <app-catalogo></app-catalogo>
          </div>

          <!-- Categorias -->
          <div *ngIf="seccionActiva === 'categorias'">
            <app-categorias></app-categorias>
          </div>

          <!-- Ventas -->
          <div *ngIf="seccionActiva === 'ventas'">
            <app-ventas></app-ventas>
          </div>

          <!-- Reportes -->
          <div *ngIf="seccionActiva === 'reportes'">
            <app-reportes></app-reportes>
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
  seccionActiva = 'dashboard';
}