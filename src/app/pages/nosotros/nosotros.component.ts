import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [NgFor],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.scss'
})
export class NosotrosComponent {
  tatuadores = [
    {
      nombre: 'Elena Vargas',
      especialidad: 'Artista del Realismo y Fundadora',
      imagen: 'https://images.unsplash.com/photo-1595085610892-38f35b5ee483?q=80&w=1887&auto=format&fit=crop'
    },
    {
      nombre: 'Marco Reyes',
      especialidad: 'Especialista en Blackwork y Geométrico',
      imagen: 'https://images.unsplash.com/photo-1588851280205-587b8134f4e1?q=80&w=1887&auto=format&fit=crop'
    },
    {
      nombre: 'Sofia Castillo',
      especialidad: 'Experta en Acuarela y Neotradicional',
      imagen: 'https://images.unsplash.com/photo-1614981273937-73406725a3f2?q=80&w=1887&auto=format&fit=crop'
    }
  ];
}
