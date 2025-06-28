import { Routes } from '@angular/router';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: 'tickets', component: TicketsComponent },
    { path: '', component: HomeComponent },
];
