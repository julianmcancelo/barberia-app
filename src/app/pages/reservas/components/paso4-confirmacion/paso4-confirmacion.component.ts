import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../../../pipes/duration.pipe';
import { Tatuador, Servicio } from '../../../../core/models';
import { ReservaService, ReservaRequest, Horario } from '../../../../core/services/reserva.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paso4-confirmacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DurationPipe],
  templateUrl: './paso4-confirmacion.component.html',
})
export class Paso4ConfirmacionComponent implements OnInit {

  @Input() reservaState: { tatuador: Tatuador | null; servicios: Servicio[]; hora: Horario | null; fecha: string } = {
    tatuador: null,
    servicios: [],
    hora: null,
    fecha: ''
  };

  @Input() duracionTotal: number = 0;

  @Output() confirmacionExitosa = new EventEmitter<string>(); // Emits token
  @Output() navegacion = new EventEmitter<'siguiente' | 'anterior'>();

  clienteForm!: FormGroup;
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['']
    });
  }

  confirmarReserva(): void {
    if (this.clienteForm.invalid || !this.reservaState.servicios.length || !this.reservaState.hora) {
      return;
    }

    this.enviando = true;

    // Asumimos un solo servicio por ahora para simplificar
    const servicioPrincipal = this.reservaState.servicios[0];

    // Create one reservation with all services combined
    const serviciosIds = this.reservaState.servicios.map(s => s.id).join(',');
    
    const reservaData: ReservaRequest = {
      nombre_completo: this.clienteForm.value.nombre_completo,
      email: this.clienteForm.value.email,
      whatsapp: this.clienteForm.value.whatsapp,
      tatuador_id: this.reservaState.tatuador?.id,
      servicio_id: serviciosIds, // Multiple services as comma-separated string
      fecha_hora: `${this.reservaState.fecha} ${this.reservaState.hora.hora}:00` // Combine date and time
    };

    console.log('Datos de reserva a enviar:', reservaData);
    console.log('Estado de reserva completo:', this.reservaState);

    this.reservaService.crearReserva(reservaData).subscribe({
      next: (response) => {
        this.enviando = false;
        this.confirmacionExitosa.emit(response.data.token_reserva);
      },
      error: (err) => {
        this.enviando = false;
        console.error('Error al crear la reserva', err);
        Swal.fire({
          icon: 'error',
          title: 'Error en la Reserva',
          text: 'No se pudo completar la reserva. Por favor, intenta de nuevo más tarde.',
          confirmButtonColor: '#C0A062',
        });
      }
    });
  }
}
