import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'  // Esto hace que el servicio esté disponible en toda la app
})
export class CategoriaService {
  private baseUrl = 'http://localhost:8080/api';
  private categoriaUrl = `${this.baseUrl}/categorias`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriaUrl);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.categoriaUrl}/${id}`);
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.categoriaUrl, categoria, { 
      headers: this.getHeaders() 
    });
  }

  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.categoriaUrl}/${id}`, categoria, { 
      headers: this.getHeaders() 
    });
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriaUrl}/${id}`);
  }
}