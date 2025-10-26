import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends BaseService {
  private productoUrl = `${this.baseUrl}/productos`;

  constructor(http: HttpClient) {
    super(http);
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.productoUrl);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.productoUrl}/${id}`);
  }

  createProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.productoUrl, producto, { 
      headers: this.getHeaders() 
    });
  }

  updateProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.productoUrl}/${id}`, producto, { 
      headers: this.getHeaders() 
    });
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productoUrl}/${id}`);
  }

  buscarProductos(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.productoUrl}/search?nombre=${nombre}`);
  }

  getProductosBajoStock(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.productoUrl}/bajo-stock`);
  }
}