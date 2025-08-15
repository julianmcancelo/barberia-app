import { Injectable } from '@angular/core';

export interface Servicio {
  nombre: string;
  descripcion: string;
  precio: string;
  duracion: number; // en minutos
}

export interface Barbero {
  nombre: string;
  especialidad: string;
  imagen?: string;
}

export interface Reserva {
  barbero: Barbero;
  servicios: Servicio[];
  fecha: Date;
  nombreCliente: string;
  duracionTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservas: Reserva[] = [];

  private servicios: Servicio[] = [
    { nombre: 'Corte de Pelo Clásico', descripcion: 'Un corte de pelo tradicional.', precio: '$25', duracion: 30 },
    { nombre: 'Afeitado de Barba con Navaja', descripcion: 'Un afeitado apurado y refrescante.', precio: '$30', duracion: 45 },
    { nombre: 'Corte y Afeitado de Lujo', descripcion: 'El paquete completo.', precio: '$50', duracion: 75 },
    { nombre: 'Diseño de Barba', descripcion: 'Damos forma y estilo a tu barba.', precio: '$20', duracion: 30 },
    { nombre: 'Tratamiento Capilar', descripcion: 'Revitaliza tu cabello.', precio: '$40', duracion: 60 },
    { nombre: 'Corte para Niños', descripcion: 'Un corte divertido y con estilo.', precio: '$20', duracion: 30 }
  ];

  private barberos: Barbero[] = [
    { nombre: 'Alejandro Gómez', especialidad: 'Maestro Barbero y Fundador' },
    { nombre: 'Carlos Mendoza', especialidad: 'Especialista en Cortes Modernos' },
    { nombre: 'Javier Ríos', especialidad: 'Experto en Afeitado Clásico' }
  ];

  constructor() { }

  getServicios() {
    return this.servicios;
  }

  getBarberos() {
    return this.barberos;
  }

  addReserva(reserva: Reserva) {
    this.reservas.push(reserva);
    console.log('Reserva añadida:', reserva);
    console.log('Todas las reservas:', this.reservas);
  }

  getHorariosDisponibles(barbero: Barbero, fecha: Date, duracionTotal: number): Date[] {
    const horariosDisponibles: Date[] = [];
    const horarioInicioDia = 9; // 9:00 AM
    const horarioFinDia = 19; // 7:00 PM
    const intervaloMinutos = 30;

    // Obtener las reservas del barbero para el día seleccionado
    const reservasDelDia = this.reservas.filter(
      r => r.barbero.nombre === barbero.nombre &&
           r.fecha.getFullYear() === fecha.getFullYear() &&
           r.fecha.getMonth() === fecha.getMonth() &&
           r.fecha.getDate() === fecha.getDate()
    );

    // Generar posibles horarios de inicio
    for (let hora = horarioInicioDia; hora < horarioFinDia; hora++) {
      for (let minuto = 0; minuto < 60; minuto += intervaloMinutos) {
        const posibleHorario = new Date(fecha.getTime());
        posibleHorario.setHours(hora, minuto, 0, 0);

        const finPosibleHorario = new Date(posibleHorario.getTime() + duracionTotal * 60000);

        // Verificar si el horario se solapa con alguna reserva existente
        const seSolapa = reservasDelDia.some(reserva => {
          const inicioReserva = reserva.fecha;
          const finReserva = new Date(inicioReserva.getTime() + reserva.duracionTotal * 60000);

          // Conflicto si: (InicioA < FinB) y (FinA > InicioB)
          return posibleHorario < finReserva && finPosibleHorario > inicioReserva;
        });

        // Si no se solapa y termina antes del fin del día, añadirlo
        if (!seSolapa && finPosibleHorario.getHours() < horarioFinDia) {
          horariosDisponibles.push(posibleHorario);
        }
      }
    }

    return horariosDisponibles;
  }

  getReservas() {
    return this.reservas;
  }
}
