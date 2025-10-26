export interface Proveedor {
  idProveedor: number;
  nombreProveedor: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  rfc?: string;
  fechaRegistro?: string;
  activo?: boolean;
}