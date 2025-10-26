export interface Proveedor {
  idProveedor?: number;  // Agrega ?
  nombreProveedor: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  rfc?: string;
  fechaRegistro?: string;
  activo?: boolean;
}