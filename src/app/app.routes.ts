import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { ReservasComponent } from './pages/reservas/reservas.component';
import { TatuadoresComponent } from './pages/tatuadores/tatuadores.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { animation: 'HomePage' } },
    { path: 'servicios', component: ServiciosComponent, data: { animation: 'ServiciosPage' } },
    { path: 'tatuadores', component: TatuadoresComponent, data: { animation: 'TatuadoresPage' } },
    { path: 'nosotros', component: NosotrosComponent, data: { animation: 'NosotrosPage' } },
    { path: 'contacto', component: ContactoComponent, data: { animation: 'ContactoPage' } },
    { path: 'reservas', component: ReservasComponent, data: { animation: 'ReservasPage' } },
    { 
        path: 'admin', 
        loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        data: { animation: 'AdminPage' } 
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
