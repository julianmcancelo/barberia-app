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
      nombre: 'Corte de Cabello Clásico',
      descripcion: 'Un corte de cabello tradicional adaptado a tu estilo, utilizando técnicas de tijera y máquina.',
      precio: '$25'
    },
    {
      nombre: 'Afeitado de Barba con Navaja',
      descripcion: 'Un afeitado de lujo con toallas calientes, espuma cremosa y un acabado suave con navaja.',
      precio: '$30'
    },
    {
      nombre: 'Diseño y Perfilado de Barba',
      descripcion: 'Dale forma y define tu barba para un look impecable y bien cuidado.',
      precio: '$20'
    },
    {
      nombre: 'Tratamiento Facial',
      descripcion: 'Relájate con una limpieza facial profunda, exfoliación y mascarilla hidratante.',
      precio: '$40'
    },
    {
      nombre: 'Corte y Barba (Paquete)',
      descripcion: 'El paquete completo para el caballero moderno: corte de cabello y afeitado o perfilado de barba.',
      precio: '$50'
    },
    {
      nombre: 'Tinte de Cabello o Barba',
      descripcion: 'Cubre las canas o cambia tu look con un tinte de color natural y duradero.',
      precio: '$35'
    }
  ];
}
