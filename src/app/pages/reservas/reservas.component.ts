import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservasService, Barbero, Servicio, Reserva } from '../../services/reservas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {
  pasoActual = 1;
  reservaForm!: FormGroup;

  barberos: Barbero[] = [];
  servicios: Servicio[] = [];
  horariosDisponibles: Date[] = [];

  barberoSeleccionado: Barbero | null = null;
  serviciosSeleccionados: Servicio[] = [];
  fechaSeleccionada: string = '';
  horaSeleccionada: Date | null = null;
  duracionTotal = 0;

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService
  ) {}

  ngOnInit(): void {
    this.barberos = this.reservasService.getBarberos();
    this.servicios = this.reservasService.getServicios();
    this.reservaForm = this.fb.group({
      nombreCliente: ['', Validators.required]
    });
  }

  // Lógica de navegación entre pasos
  siguientePaso() { this.pasoActual++; }
  pasoAnterior() { this.pasoActual--; }

  // Paso 1: Selección de Barbero
  seleccionarBarbero(barbero: Barbero) {
    this.barberoSeleccionado = barbero;
    this.siguientePaso();
  }

  // Paso 2: Selección de Servicios
  toggleServicio(servicio: Servicio) {
    const index = this.serviciosSeleccionados.findIndex(s => s.nombre === servicio.nombre);
    if (index > -1) {
      this.serviciosSeleccionados.splice(index, 1);
    } else {
      this.serviciosSeleccionados.push(servicio);
    }
    this.duracionTotal = this.serviciosSeleccionados.reduce((total, s) => total + s.duracion, 0);
  }

  // Paso 3: Selección de Fecha y Hora
  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.value;
    this.actualizarHorariosDisponibles();
  }

  actualizarHorariosDisponibles() {
    if (this.barberoSeleccionado && this.fechaSeleccionada && this.duracionTotal > 0) {
      const fecha = new Date(this.fechaSeleccionada);
      const fechaAjustada = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());
      this.horariosDisponibles = this.reservasService.getHorariosDisponibles(this.barberoSeleccionado, fechaAjustada, this.duracionTotal);
    } else {
      this.horariosDisponibles = [];
    }
  }

  seleccionarHora(hora: Date) {
    this.horaSeleccionada = hora;
  }

  // Paso 4: Confirmación
  confirmarReserva() {
    if (this.reservaForm.valid && this.barberoSeleccionado && this.horaSeleccionada) {
      const nuevaReserva: Reserva = {
        barbero: this.barberoSeleccionado,
        servicios: this.serviciosSeleccionados,
        fecha: this.horaSeleccionada,
        nombreCliente: this.reservaForm.value.nombreCliente,
        duracionTotal: this.duracionTotal
      };

      this.reservasService.addReserva(nuevaReserva);
      Swal.fire('¡Éxito!', 'Tu reserva ha sido confirmada.', 'success');
      this.resetearFlujo();
    } else {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
    }
  }

  resetearFlujo() {
    this.pasoActual = 1;
    this.barberoSeleccionado = null;
    this.serviciosSeleccionados = [];
    this.fechaSeleccionada = '';
    this.horaSeleccionada = null;
    this.duracionTotal = 0;
    this.reservaForm.reset();
  }
}
