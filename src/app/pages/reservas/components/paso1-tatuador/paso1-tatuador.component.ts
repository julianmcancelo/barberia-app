import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tatuador } from '../../../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paso1-tatuador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso1-tatuador.component.html',
  styleUrls: ['./paso1-tatuador.component.scss']
})
export class Paso1TatuadorComponent {
  @Input() tatuadores: Tatuador[] = [];
  @Output() tatuadorSeleccionado = new EventEmitter<Tatuador>();

  seleccionarTatuador(tatuador: Tatuador): void {
    this.tatuadorSeleccionado.emit(tatuador);
  }
}
