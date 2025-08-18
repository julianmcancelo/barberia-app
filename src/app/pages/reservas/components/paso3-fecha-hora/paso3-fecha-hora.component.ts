import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tatuador } from '../../../../core/models';
import { ReservaService, Horario } from '../../../../core/services/reserva.service';

@Component({
  selector: 'app-paso3-fecha-hora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso3-fecha-hora.component.html',
  styleUrls: ['./paso3-fecha-hora.component.scss']
})
export class Paso3FechaHoraComponent implements OnChanges {
  @Input() tatuadorSeleccionado: Tatuador | null = null;
  @Input() fechaSeleccionada: string = '';
  @Input() horaSeleccionada: Horario | null = null;
  @Input() duracionTotal: number = 0;

  @Output() fechaSeleccionadaChange = new EventEmitter<string>();
  @Output() horaSeleccionadaChange = new EventEmitter<Horario | null>();
  @Output() navegacion = new EventEmitter<'siguiente' | 'anterior'>();

  horariosDisponibles: Horario[] = [];

  constructor(private reservaService: ReservaService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tatuadorSeleccionado'] || changes['fechaSeleccionada'] || changes['duracionTotal']) {
      this.actualizarHorariosDisponibles();
    }
  }

  actualizarHorariosDisponibles() {
    console.log('Actualizando horarios:', {
      tatuador: this.tatuadorSeleccionado,
      fecha: this.fechaSeleccionada,
      duracion: this.duracionTotal
    });
    
    if (this.tatuadorSeleccionado && this.duracionTotal > 0) {
      const fecha = this.fechaSeleccionada ? new Date(this.fechaSeleccionada) : new Date();
      const fechaAjustada = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());
      this.reservaService.getHorariosDisponibles(this.tatuadorSeleccionado, fechaAjustada, this.duracionTotal)
        .subscribe(horarios => {
          console.log('Horarios recibidos:', horarios);
          this.horariosDisponibles = horarios;
          if (this.horaSeleccionada && !this.horariosDisponibles.some(h => h.hora === this.horaSeleccionada?.hora)) {
            this.seleccionarHora(null);
          }
        });
    } else {
      this.horariosDisponibles = [];
    }
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionadaChange.emit(input.value);
  }

  seleccionarHora(hora: Horario | null) {
    this.horaSeleccionadaChange.emit(hora);
  }
}
