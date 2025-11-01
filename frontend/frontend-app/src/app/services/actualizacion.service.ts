import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActualizacionService {
  private actualizacionProductosSubject = new Subject<void>();
  actualizacionProductos$ = this.actualizacionProductosSubject.asObservable();

  notificarActualizacionProductos() {
    this.actualizacionProductosSubject.next();
  }
}