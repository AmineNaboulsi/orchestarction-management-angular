import { Routes } from '@angular/router';
import { TicketsComponentPage } from './features/tasks-management/tickets-page/tickets.component';
import { TicketViewComponent } from './features/tasks-management/ticket-view/ticket-view.component';
import { ProcessPageComponent } from './features/process-management/process-page/process-page.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { ProcessViewComponent } from './features/process-management/process-view/process-view.component';
import { ProcessRunComponent } from './features/process-management/process-run/process-run.component';
import { TicketCreateComponent } from './features/tasks-management/ticket-create/ticket-create.component';

export const routes: Routes = [
    { path: 'tasks', component: TicketsComponentPage },
    { path: 'tasks/create', component: TicketCreateComponent },
    { path: 'tasks/view/:id', component: TicketViewComponent },
    { path: 'tasks/edit/:id', component: TicketViewComponent },
    { path: 'process', component: ProcessPageComponent },
    { path: 'process/run', component: ProcessRunComponent },
    { path: 'processes/:id', component: ProcessViewComponent },
    { path: 'processes/view/:id', component: ProcessViewComponent },
    { path: '', component: HomeComponent },
];
