import { Routes } from '@angular/router';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { HomeComponent } from './pages/home/home.component';
import { ProcessesComponent } from './pages/processes/processes.component';
import { TicketViewComponent } from './pages/ticket-view/ticket-view.component';

export const routes: Routes = [
    { path: 'tickets', component: TicketsComponent },
    { path: 'tickets/:id', component: TicketViewComponent },
    { path: 'process', component: ProcessesComponent },
    { path: '', component: HomeComponent },
];
