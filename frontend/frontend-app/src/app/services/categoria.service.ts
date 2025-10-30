import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Categoria } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BaseService {
  private categoriaUrl = `${this.baseUrl}/categorias`;

  constructor(http: HttpClient) {
    super(http);
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