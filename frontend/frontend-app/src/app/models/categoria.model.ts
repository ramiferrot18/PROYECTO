export interface Categoria {
  idCategoria?: number;  // Cambia a opcional con ?
  nombreCategoria: string;
  descripcion?: string;
  fechaCreacion?: string;
  activo?: boolean;
}