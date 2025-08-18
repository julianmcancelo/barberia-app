import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminTatuadoresComponent } from '../admin-tatuadores/admin-tatuadores.component';
import { AdminCuponesComponent } from '../admin-cupones/admin-cupones.component';
import { authGuard } from '../../guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
    { 
        path: '', 
        component: AdminComponent,
        canActivate: [authGuard] 
    },
    { 
        path: 'tatuadores', 
        component: AdminTatuadoresComponent,
        canActivate: [authGuard] 
    },
    { 
        path: 'cupones', 
        component: AdminCuponesComponent,
        canActivate: [authGuard] 
    }
];
