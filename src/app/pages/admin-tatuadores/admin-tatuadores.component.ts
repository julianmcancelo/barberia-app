import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TatuadorService, Tatuador, ApiResponse } from '../../core/services/tatuador.service';

@Component({
  selector: 'app-admin-tatuadores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-tatuadores.component.html',
  styleUrls: ['./admin-tatuadores.component.scss']
})
export class AdminTatuadoresComponent implements OnInit {
  tatuadores: Tatuador[] = [];
  filteredTatuadores: Tatuador[] = [];
  loading = false;
  showForm = false;
  editingId: number | null = null;
  tatuadorForm: FormGroup;
  searchTerm = '';
  filterSpecialty = '';
  showSuccessMessage = false;
  successMessage = '';
  showErrorMessage = false;
  errorMessage = '';
  submitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  specialties = [
    'Realismo',
    'Traditional',
    'Blackwork',
    'Acuarela',
    'Neotradicional',
    'Geométrico',
    'Minimalista',
    'Japonés',
    'Biomecánico',
    'Tribal'
  ];

  constructor(
    private tatuadorService: TatuadorService,
    private fb: FormBuilder
  ) {
    this.tatuadorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especialidad: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      instagram: ['', [Validators.pattern(/^@?[a-zA-Z0-9._]+$/)]],
      experiencia: ['', [Validators.required]],
      imagen: ['']
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
          this.filteredTatuadores = [...this.tatuadores];
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tatuadores:', error);
        this.showError('Error al cargar los tatuadores');
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredTatuadores = this.tatuadores.filter(tatuador => {
      const matchesSearch = !this.searchTerm || 
        tatuador.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tatuador.especialidad.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesSpecialty = !this.filterSpecialty || 
        tatuador.especialidad === this.filterSpecialty;
      
      return matchesSearch && matchesSpecialty;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onSpecialtyFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterSpecialty = '';
    this.applyFilters();
  }

  showAddForm() {
    this.showForm = true;
    this.editingId = null;
    this.tatuadorForm.reset();
  }

  editTatuador(tatuador: Tatuador) {
    this.showForm = true;
    this.editingId = tatuador.id!;
    this.selectedFile = null;
    this.imagePreview = tatuador.imagen || null;
    this.tatuadorForm.patchValue({
      nombre: tatuador.nombre,
      especialidad: tatuador.especialidad,
      descripcion: tatuador.descripcion,
      telefono: tatuador.telefono,
      email: tatuador.email,
      instagram: tatuador.instagram,
      experiencia: tatuador.experiencia,
      imagen: tatuador.imagen
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.tatuadorForm.patchValue({ imagen: '' });
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.tatuadorForm.reset();
    this.hideMessages();
  }

  onSubmit() {
    if (this.tatuadorForm.valid) {
      this.submitting = true;
      const formData = { ...this.tatuadorForm.value };
      
      // Handle image upload
      if (this.selectedFile) {
        // In a real app, you would upload the file to a server
        // For now, we'll use a placeholder URL
        formData.imagen = `assets/images/tatuadores/${this.selectedFile.name}`;
      }

      if (this.editingId) {
        // Update existing tatuador
        const updateData = { ...formData, id: this.editingId };
        this.tatuadorService.updateTatuador(updateData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.showSuccess('Tatuador actualizado exitosamente');
              this.loadTatuadores();
              this.cancelForm();
            }
            this.submitting = false;
          },
          error: (error) => {
            console.error('Error updating tatuador:', error);
            this.showError('Error al actualizar el tatuador');
            this.submitting = false;
          }
        });
      } else {
        // Add new tatuador
        this.tatuadorService.addTatuador(formData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.showSuccess('Tatuador agregado exitosamente');
              this.loadTatuadores();
              this.cancelForm();
            }
            this.submitting = false;
          },
          error: (error) => {
            console.error('Error adding tatuador:', error);
            this.showError('Error al agregar el tatuador');
            this.submitting = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteTatuador(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      this.tatuadorService.deleteTatuador(id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.showSuccess('Tatuador eliminado exitosamente');
            this.loadTatuadores();
          }
        },
        error: (error) => {
          console.error('Error deleting tatuador:', error);
          this.showError('Error al eliminar el tatuador');
        }
      });
    }
  }

  // Utility methods
  showSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
    this.showErrorMessage = false;
    setTimeout(() => this.hideMessages(), 5000);
  }

  showError(message: string) {
    this.errorMessage = message;
    this.showErrorMessage = true;
    this.showSuccessMessage = false;
    setTimeout(() => this.hideMessages(), 5000);
  }

  hideMessages() {
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
  }

  markFormGroupTouched() {
    Object.keys(this.tatuadorForm.controls).forEach(key => {
      const control = this.tatuadorForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.tatuadorForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) {
        if (fieldName === 'telefono') return 'Formato de teléfono inválido';
        if (fieldName === 'instagram') return 'Formato de Instagram inválido (ej: @usuario)';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tatuadorForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
