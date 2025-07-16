import { Routes } from '@angular/router';
import { TicketsComponentPage } from './features/tasks-management/tickets-page/tickets.component';
import { TicketViewComponent } from './features/tasks-management/ticket-view/ticket-view.component';
import { TicketEditComponent } from './features/tasks-management/ticket-edit/ticket-edit.component';
import { ProcessPageComponent } from './features/process-management/process-page/process-page.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { ProcessViewComponent } from './features/process-management/process-view/process-view.component';
import { TicketCreateComponent } from './features/tasks-management/ticket-create/ticket-create.component';
import { AuthGuard } from './services/auth/guards/auth.guard';
import { ProcessDeployComponent } from './features/process-management/process-deploy/process-deploy.component';

export const routes: Routes = [
    { path: 'tasks', component: TicketsComponentPage },
    { path: 'tasks/create', component: TicketCreateComponent },
    { path: 'tasks/view/:id', component: TicketViewComponent },
    { path: 'tasks/edit/:id', component: TicketEditComponent, canActivate: [AuthGuard],data: { roles: ['admin'] } },
    { path: 'process', component: ProcessPageComponent, canActivate: [AuthGuard],data: { roles: ['admin'] }  },
    { path: 'processes/:id', component: ProcessViewComponent, canActivate: [AuthGuard],data: { roles: ['admin'] }  },
    { path: 'processes/deploy', component: ProcessDeployComponent },
    { path: 'processes/view/:id', component: ProcessViewComponent, canActivate: [AuthGuard],data: { roles: ['admin'] }  },
    { path: '', component: HomeComponent },
];
