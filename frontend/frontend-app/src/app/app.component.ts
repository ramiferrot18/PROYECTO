import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">
          🏪 Mi Tienda de Abarrotes
        </a>
      </div>
    </nav>

    <div class="container mt-4">
      <div class="row">
        <div class="col-md-3">
          <!-- Menú lateral -->
          <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action active">
              📊 Dashboard
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              📦 Productos
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              🏷️ Categorías
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              🚚 Proveedores
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              💰 Ventas
            </a>
          </div>
        </div>
        
        <div class="col-md-9">
          <!-- Contenido principal -->
          <div class="card">
            <div class="card-header">
              <h4>Bienvenido al Sistema de Inventarios</h4>
            </div>
            <div class="card-body">
              <p>Tu sistema de control de inventarios está listo para usar.</p>
              <div class="row">
                <div class="col-md-3">
                  <div class="card text-white bg-primary">
                    <div class="card-body">
                      <h5>Productos</h5>
                      <h2>0</h2>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-success">
                    <div class="card-body">
                      <h5>Categorías</h5>
                      <h2>0</h2>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-warning">
                    <div class="card-body">
                      <h5>Proveedores</h5>
                      <h2>0</h2>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-info">
                    <div class="card-body">
                      <h5>Ventas Hoy</h5>
                      <h2>0</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'Mi Tienda de Abarrotes';
}