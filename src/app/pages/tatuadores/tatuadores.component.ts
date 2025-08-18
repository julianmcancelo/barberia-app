import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TatuadorService } from '../../core/services/tatuador.service';
import { Tatuador } from '../../core/models';

@Component({
  selector: 'app-tatuadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tatuadores.component.html',
  styleUrls: ['./tatuadores.component.scss']
})
export class TatuadoresComponent implements OnInit {
  tatuadores: Tatuador[] = [];
  loading = false;

  constructor(
    private tatuadorService: TatuadorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTatuadores();
  }

  loadTatuadores() {
    this.loading = true;
    this.tatuadorService.getTatuadores().subscribe({
      next: (response) => {
        if (response && response.status === 'success') {
          this.tatuadores = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tatuadores:', error);
        this.loading = false;
      }
    });
  }

  reservarConTatuador(tatuador: Tatuador | null) {
    // Navigate to reservas page with tatuador pre-selected
    if (tatuador) {
      this.router.navigate(['/reservas'], { 
        queryParams: { tatuadorId: tatuador.id } 
      });
    } else {
      this.router.navigate(['/reservas']);
    }
  }
}
