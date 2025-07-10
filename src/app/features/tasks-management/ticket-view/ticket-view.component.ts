import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';
import { ApiResponseTaskDto, TaskBpmApiService, TaskDto } from '../../../services/generated/api-client';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-ticket-view',
  standalone: true,
  imports: [NgIf, DatePipe,ToastModule,MatProgressSpinnerModule,ConfirmDialogModule,
    BreadcrumbNavigationComponent, MatIconModule],
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
})
export class TicketViewComponent implements OnInit {
  taskId: string | null = null;
  task: TaskDto | undefined;
  loading = false;
  error: string | null = null;
  isLoading = false;

  constructor(
    private taskBpmApi: TaskBpmApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.loadTaskById(this.taskId);
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
  
    /**
   * 
   * @param taskId 
   * @returns 
   */
  confirmeCompletion(taskId: string | undefined){
    if (!taskId) {
        alert('Invalid task ID');
        return;
    }
    this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Are you sure you want to complete this task ?',
            icon: 'pi pi-exclamation-circle',
            rejectButtonProps: {
                label: 'Cancel',
                icon: 'pi pi-times',
                outlined: true,
                size: 'small'
            },
            acceptButtonProps: {
                label: 'Save',
                icon: 'pi pi-check',
                size: 'small'
            },
            accept: () => {
                this.completeTask(taskId)
            }
        });
  }
  completeTask(taskId: string | undefined) {
    this.isLoading = true;
    this.taskBpmApi.completeTask("x-api-requestId", "", taskId || '', {
      Variables: {}
    }).subscribe({
      next: (response: ApiResponseTaskDto) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: response?.message
        });
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error: (er) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error ', 
          detail: er?.error?.message
        });
        this.isLoading = false;
      },
    });
  }


  loadTaskById(taskId: string): void {
    this.loading = true;
    this.error = null;
    this.task = undefined;

    this.taskBpmApi.getTaskById('', '', taskId).subscribe({
      next : (response: ApiResponseTaskDto) =>{
        this.task = response.body || undefined;
        
        this.loading = false;
      },
      error: (err)=> {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: err
            });
        console.error('Error loading task:', err);
      }
    });
  }

  retry(): void {
    if (this.taskId) {
      this.loadTaskById(this.taskId);
    }
  }

}