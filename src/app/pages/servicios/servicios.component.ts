import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [NgFor],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent {
  servicios = [
    {
      nombre: 'Tatuaje Tradicional',
      descripcion: 'Diseños clásicos con líneas definidas y colores vibrantes en el estilo tradicional americano.',
      precio: '$25.000/hora'
    },
    {
      nombre: 'Tatuaje Realista',
      descripcion: 'Retratos y diseños hiperrealistas con técnicas avanzadas de sombreado y detalle.',
      precio: '$30.000/hora'
    },
    {
      nombre: 'Blackwork',
      descripcion: 'Diseños en negro sólido, geométricos y minimalistas con gran impacto visual.',
      precio: '$20.000/hora'
    },
    {
      nombre: 'Tatuaje Acuarela',
      descripcion: 'Diseños delicados con efectos de acuarela y colores difuminados únicos.',
      precio: '$28.000/hora'
    },
    {
      nombre: 'Diseño Personalizado',
      descripcion: 'Consulta y creación de diseño único adaptado a tus ideas y anatomía.',
      precio: '$15.000'
    },
    {
      nombre: 'Retoque',
      descripcion: 'Retoque gratuito dentro de los 30 días para garantizar la calidad del trabajo.',
      precio: 'Gratis'
    }
  ];
}
