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
  barberos = [
    {
      nombre: 'Alejandro Gómez',
      especialidad: 'Maestro Barbero y Fundador',
      imagen: 'https://images.unsplash.com/photo-1559582823-7544503544c1?q=80&w=1887&auto=format&fit=crop'
    },
    {
      nombre: 'Carlos Mendoza',
      especialidad: 'Especialista en Cortes Modernos',
      imagen: 'https://images.unsplash.com/photo-1532710093739-94705e6aa483?q=80&w=1887&auto=format&fit=crop'
    },
    {
      nombre: 'Javier Ríos',
      especialidad: 'Experto en Afeitado Clásico',
      imagen: 'https://images.unsplash.com/photo-1622288432453-53145233a738?q=80&w=1887&auto=format&fit=crop'
    }
  ];
}
