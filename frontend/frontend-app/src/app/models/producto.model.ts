import { Categoria } from './categoria.model';
import { Proveedor } from './proveedor.model';

export interface Producto {
  idProducto?: number;  // Agrega ?
  codigoBarras?: string;
  nombreProducto: string;
  descripcion?: string;
  categoria: Categoria;
  proveedor?: Proveedor;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  unidadMedida?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  activo?: boolean;
}