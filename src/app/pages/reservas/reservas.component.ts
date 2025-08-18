import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Tatuador, Servicio } from '../../core/models';
import { ApiResponse } from '../../core/services/tatuador.service';
import { ServicioService } from '../../services/servicio.service';
import { TatuadorService } from '../../core/services/tatuador.service';
import { Horario } from '../../core/services/reserva.service'; // Import Horario
import Swal from 'sweetalert2';

// Componentes de Pasos
import { Paso1TatuadorComponent } from './components/paso1-tatuador/paso1-tatuador.component';
import { Paso2ServiciosComponent } from './components/paso2-servicios/paso2-servicios.component';
import { Paso3FechaHoraComponent } from './components/paso3-fecha-hora/paso3-fecha-hora.component';
import { Paso4ConfirmacionComponent } from './components/paso4-confirmacion/paso4-confirmacion.component';

interface ReservaState {
  tatuador: Tatuador | null;
  servicios: Servicio[];
  hora: Horario | null; // Changed to Horario
  fecha: string;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    Paso1TatuadorComponent,
    Paso2ServiciosComponent,
    Paso3FechaHoraComponent,
    Paso4ConfirmacionComponent,
  ],
  templateUrl: './reservas.component.html',
})
export class ReservasComponent implements OnInit {
  pasoActual = 1;
  servicios: Servicio[] = [];
  tatuadores: Tatuador[] = [];

  reservaState: ReservaState = {
    tatuador: null,
    servicios: [],
    hora: null,
    fecha: '',
  };
  duracionTotal = 0;

  reservaConfirmada = false;
  tokenReserva: string | null = null;

  constructor(
    private servicioService: ServicioService,
    private tatuadorService: TatuadorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Cargar servicios
    this.servicioService.getServicios().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.servicios = response.data;
        }
      },
      error: (error) => {
        console.error('Error fetching servicios:', error);
      }
    });

    // Cargar tatuadores
    console.log('Iniciando carga de tatuadores...');
    this.tatuadorService.getTatuadores().subscribe({
      next: (response) => {
        console.log('Respuesta del servicio tatuadores:', response);
        if (response && response.status === 'success') {
          console.log('Tatuadores recibidos:', response.data);
          this.tatuadores = response.data;
          // Store tatuadores in component property, not in reservaState
          this.tatuadores.unshift({ id: 0, nombre: 'Cualquier tatuador/a', especialidad: 'General' });
          
          // Check for pre-selected tatuador from query params
          this.route.queryParams.subscribe(params => {
            const tatuadorId = params['tatuadorId'];
            if (tatuadorId) {
              const selectedTatuador = this.tatuadores.find(t => t.id == tatuadorId);
              if (selectedTatuador) {
                this.reservaState.tatuador = selectedTatuador;
                console.log('Tatuador preseleccionado:', selectedTatuador);
              } else {
                this.reservaState.tatuador = this.tatuadores[0];
              }
            } else {
              this.reservaState.tatuador = this.tatuadores[0];
            }
          });
          
          console.log('Tatuadores finales:', this.tatuadores);
        } else {
          console.log('Respuesta no exitosa o nula:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching tatuadores:', error);
      }
    });
  }

  cambiarPaso(direccion: 'siguiente' | 'anterior' | number): void {
    if (typeof direccion === 'number') {
      this.pasoActual = direccion;
    } else {
      this.pasoActual += (direccion === 'siguiente' ? 1 : -1);
    }
  }

  onServiciosSeleccionados(servicios: Servicio[]): void {
    this.reservaState.servicios = servicios;
    this.duracionTotal = servicios.reduce((total, s) => total + s.duracion, 0);
    console.log('Servicios seleccionados:', servicios);
    console.log('Duración total calculada:', this.duracionTotal);
  }

  onTatuadorSeleccionado(tatuador: Tatuador | null): void {
    this.reservaState.tatuador = tatuador;
    console.log('Tatuador seleccionado:', tatuador);
    this.cambiarPaso('siguiente');
  }

  onHoraSeleccionada(hora: Horario | null): void { // Changed to Horario
    if (!hora) return; // No avanzar si la hora es nula
    this.reservaState.hora = hora;
    this.cambiarPaso('siguiente');
  }

  onReservaExitosa(token: string): void {
    this.tokenReserva = token;
    this.reservaConfirmada = true;
    Swal.fire({
      icon: 'success',
      title: '¡Reserva Confirmada!',
      html: `Tu reserva se ha completado con éxito.<br>Tu código de reserva es: <strong>${token}</strong>`,
      confirmButtonText: '¡Entendido!',
      confirmButtonColor: '#C0A062',
    });
  }

  reiniciarProceso(): void {
    this.pasoActual = 1;
    this.reservaState = { tatuador: this.tatuadores[0], servicios: [], hora: null, fecha: '' };
    this.duracionTotal = 0;
    this.reservaConfirmada = false;
    this.tokenReserva = null;
  }
}

