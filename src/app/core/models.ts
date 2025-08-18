export interface Tatuador {
  id?: number;
  nombre: string;
  especialidad: string;
  descripcion?: string;
  telefono?: string;
  email?: string;
  instagram?: string;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: string;
}
