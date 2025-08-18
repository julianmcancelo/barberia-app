import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TatuadorService, Tatuador, ApiResponse } from '../../core/services/tatuador.service';

@Component({
  selector: 'app-admin-tatuadores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-tatuadores.component.html',
  styleUrls: ['./admin-tatuadores.component.scss']
})
export class AdminTatuadoresComponent implements OnInit {
  tatuadores: Tatuador[] = [];
  loading = false;
  showForm = false;
  editingId: number | null = null;
  tatuadorForm: FormGroup;

  constructor(
    private tatuadorService: TatuadorService,
    private fb: FormBuilder
  ) {
    this.tatuadorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especialidad: ['', [Validators.required]],
      descripcion: [''],
      telefono: [''],
      email: ['', [Validators.email]],
      instagram: ['']
    });
  }

  ngOnInit() {
    this.loadTatuadores();
  }

  loadTatuadores() {
    this.loading = true;
    this.tatuadorService.getTatuadores().subscribe({
      next: (response: ApiResponse<Tatuador[]>) => {
        if (response.status === 'success') {
          this.tatuadores = response.data;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tatuadores:', error);
        this.loading = false;
      }
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editingId = null;
    this.tatuadorForm.reset();
  }

  editTatuador(tatuador: Tatuador) {
    this.showForm = true;
    this.editingId = tatuador.id!;
    this.tatuadorForm.patchValue({
      nombre: tatuador.nombre,
      especialidad: tatuador.especialidad,
      descripcion: tatuador.descripcion,
      telefono: tatuador.telefono,
      email: tatuador.email,
      instagram: tatuador.instagram
    });
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.tatuadorForm.reset();
  }

  onSubmit() {
    if (this.tatuadorForm.valid) {
      const formData = this.tatuadorForm.value;
      
      if (this.editingId) {
        // Update existing tatuador
        const updateData = { ...formData, id: this.editingId };
        this.tatuadorService.updateTatuador(updateData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.loadTatuadores();
              this.cancelForm();
            }
          },
          error: (error) => {
            console.error('Error updating tatuador:', error);
          }
        });
      } else {
        // Add new tatuador
        this.tatuadorService.addTatuador(formData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.loadTatuadores();
              this.cancelForm();
            }
          },
          error: (error) => {
            console.error('Error adding tatuador:', error);
          }
        });
      }
    }
  }

  deleteTatuador(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este tatuador?')) {
      this.tatuadorService.deleteTatuador(id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadTatuadores();
          }
        },
        error: (error) => {
          console.error('Error deleting tatuador:', error);
        }
      });
    }
  }
}
