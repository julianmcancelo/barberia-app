import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservaService, ReservaAdmin } from '../../core/services/reserva.service';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, DurationPipe, DatePipe],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  reservas: ReservaAdmin[] = [];
  loading = true;
  filtroEstado = 'todas';
  reservasFiltradas: ReservaAdmin[] = [];

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading = true;
    this.reservaService.getReservasAdmin().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.reservas = response.data;
          this.aplicarFiltro();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando reservas:', error);
        this.loading = false;
      }
    });
  }

  aplicarFiltro(): void {
    if (this.filtroEstado === 'todas') {
      this.reservasFiltradas = this.reservas;
    } else {
      this.reservasFiltradas = this.reservas.filter(r => r.estado === this.filtroEstado);
    }
  }

  cambiarEstado(reserva: ReservaAdmin, nuevoEstado: string): void {
    this.reservaService.updateReservaEstado(reserva.id, nuevoEstado).subscribe({
      next: () => {
        reserva.estado = nuevoEstado;
        this.aplicarFiltro();
      },
      error: (error) => {
        console.error('Error actualizando estado:', error);
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'confirmada': return 'bg-green-500 text-white';
      case 'pendiente': return 'bg-yellow-500 text-black';
      case 'cancelada': return 'bg-red-500 text-white';
      case 'completada': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
}
