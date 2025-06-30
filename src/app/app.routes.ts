import { Routes } from '@angular/router';
import { TicketsComponentPage } from './features/tasks-management/tickets-page/tickets.component';
import { TicketViewComponent } from './features/tasks-management/ticket-view/ticket-view.component';
import { ProcessPageComponent } from './features/process-management/process-page/process-page.component';
import { HomeComponent } from './features/dashboard/home/home.component';

export const routes: Routes = [
    { path: 'tickets', component: TicketsComponentPage },
    { path: 'tickets/view/:id', component: TicketViewComponent },
    { path: 'process', component: ProcessPageComponent },
    { path: '', component: HomeComponent },
];
