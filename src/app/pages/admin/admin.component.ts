import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService, Reserva } from '../../services/reservas.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  reservas: Reserva[] = [];

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.reservas = this.reservasService.getReservas();
  }
}
