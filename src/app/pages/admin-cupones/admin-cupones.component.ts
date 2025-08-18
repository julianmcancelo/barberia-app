import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CuponService, Cupon } from '../../core/services/cupon.service';

@Component({
  selector: 'app-admin-cupones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-cupones.component.html',
  styleUrls: ['./admin-cupones.component.scss']
})
export class AdminCuponesComponent implements OnInit {
  cupones: Cupon[] = [];
  loading = false;
  showForm = false;
  editingId: number | null = null;
  cuponForm: FormGroup;

  constructor(
    private cuponService: CuponService,
    private fb: FormBuilder
  ) {
    this.cuponForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      tipo_descuento: ['porcentaje', [Validators.required]],
      valor_descuento: [0, [Validators.required, Validators.min(0)]],
      monto_minimo: [0, [Validators.min(0)]],
      fecha_inicio: ['', [Validators.required]],
      fecha_expiracion: ['', [Validators.required]],
      usos_maximos: [null],
      solo_primera_vez: [false]
    });
  }

  ngOnInit() {
    this.loadCupones();
  }

  loadCupones() {
    this.loading = true;
    this.cuponService.getCupones().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.cupones = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cupones:', error);
        this.loading = false;
      }
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editingId = null;
    this.cuponForm.reset({
      tipo_descuento: 'porcentaje',
      valor_descuento: 0,
      monto_minimo: 0,
      solo_primera_vez: false
    });
  }

  editCupon(cupon: Cupon) {
    this.showForm = true;
    this.editingId = cupon.id!;
    this.cuponForm.patchValue({
      codigo: cupon.codigo,
      nombre: cupon.nombre,
      descripcion: cupon.descripcion,
      tipo_descuento: cupon.tipo_descuento,
      valor_descuento: cupon.valor_descuento,
      monto_minimo: cupon.monto_minimo,
      fecha_inicio: cupon.fecha_inicio,
      fecha_expiracion: cupon.fecha_expiracion,
      usos_maximos: cupon.usos_maximos,
      solo_primera_vez: cupon.solo_primera_vez
    });
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.cuponForm.reset();
  }

  onSubmit() {
    if (this.cuponForm.valid) {
      const formData = this.cuponForm.value;
      
      if (this.editingId) {
        // Update existing cupon
        const updateData = { ...formData, id: this.editingId };
        this.cuponService.updateCupon(updateData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.loadCupones();
              this.cancelForm();
            }
          },
          error: (error) => {
            console.error('Error updating cupon:', error);
          }
        });
      } else {
        // Add new cupon
        this.cuponService.addCupon(formData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.loadCupones();
              this.cancelForm();
            }
          },
          error: (error) => {
            console.error('Error adding cupon:', error);
          }
        });
      }
    }
  }

  deleteCupon(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este cupón?')) {
      this.cuponService.deleteCupon(id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadCupones();
          }
        },
        error: (error) => {
          console.error('Error deleting cupon:', error);
        }
      });
    }
  }

  getDiscountText(cupon: Cupon): string {
    if (cupon.tipo_descuento === 'porcentaje') {
      return `${cupon.valor_descuento}%`;
    } else {
      return `$${cupon.valor_descuento}`;
    }
  }

  isExpired(cupon: Cupon): boolean {
    return new Date(cupon.fecha_expiracion) < new Date();
  }

  isExhausted(cupon: Cupon): boolean {
    return cupon.usos_maximos ? cupon.usos_actuales >= cupon.usos_maximos : false;
  }
}
