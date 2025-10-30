import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Producto } from './producto.service';

export interface DetalleVenta {
  idDetalle?: number;
  producto: any;
  cantidad: number;
  precioUnitario: number;
  importeTotal: number;
}

export interface Venta {
  idVenta?: number;
  folioVenta?: string;
  totalVenta: number;
  fechaVenta?: string;
  metodoPago?: string;
  pagoEfectivo?: number;
  pagoTarjeta?: number;
  cambio?: number;
  usuario?: string;
  detalles: DetalleVenta[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService extends BaseService {
  private ventaUrl = `${this.baseUrl}/ventas`;

  constructor(http: HttpClient) {
    super(http);
  }

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.ventaUrl);
  }

  getVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.ventaUrl}/${id}`);
  }

  createVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.ventaUrl, venta, { 
      headers: this.getHeaders() 
    });
  }

  getVentasPorFecha(fechaInicio: string, fechaFin: string): Observable<Venta[]> {
    return this.http.get<Venta[]>(
      `${this.ventaUrl}/filtro?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  getVentasHoy(): Observable<Venta[]> {
    const hoy = new Date().toISOString().split('T')[0];
    return this.getVentasPorFecha(hoy, hoy);
  }
}