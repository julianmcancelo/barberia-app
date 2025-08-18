import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Tatuador, Servicio } from '../../../../core/models';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../../../pipes/duration.pipe';

@Component({
  selector: 'app-paso2-servicios',
  standalone: true,
  imports: [CommonModule, DurationPipe],
  templateUrl: './paso2-servicios.component.html',
  styleUrls: ['./paso2-servicios.component.scss']
})
export class Paso2ServiciosComponent implements OnInit {
  @Input() tatuadorSeleccionado: Tatuador | null = null;
  @Input() servicios: Servicio[] = [];
  @Input() serviciosElegidos: Servicio[] = [];
  @Output() serviciosElegidosChange = new EventEmitter<Servicio[]>();
  @Output() navegacion = new EventEmitter<'siguiente' | 'anterior'>();

  duracionTotal = 0;

  ngOnInit(): void {
    this.calcularDuracionTotal();
  }

  toggleServicio(servicio: Servicio) {
    const index = this.serviciosElegidos.findIndex(s => s.nombre === servicio.nombre);
    if (index > -1) {
      this.serviciosElegidos.splice(index, 1);
    } else {
      this.serviciosElegidos.push(servicio);
    }
    this.calcularDuracionTotal();
    this.serviciosElegidosChange.emit(this.serviciosElegidos);
  }

  calcularDuracionTotal() {
    this.duracionTotal = this.serviciosElegidos.reduce((total, s) => total + s.duracion, 0);
  }

  estaSeleccionado(servicio: Servicio): boolean {
    return this.serviciosElegidos.some(s => s.nombre === servicio.nombre);
  }
}
