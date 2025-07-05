import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';
import { ApiResponseTaskDto, TaskBpmApiService, TaskDto } from '../../../services/generated/api-client';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-ticket-view',
  standalone: true,
  imports: [NgIf, DatePipe,ToastModule,MatProgressSpinnerModule,
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
    private messageService: MessageService

  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.loadTaskById(this.taskId);
    }
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
  
    /**
   * 
   * @param taskId 
   * @returns 
   */
  completeTask(taskId: string | undefined) {
    if (!taskId) {
        alert('Invalid task ID');
        return;
    }
    if (!confirm('Are you sure you want to complete this task?')) {
      return;
    }
    this.isLoading = true;
    this.taskBpmApi.completeTask("", "", taskId, {
      Variables: {}
    }).subscribe({
      next: (response: ApiResponseTaskDto) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: response?.message
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'unauthorised acces for this operation, please verify your permission'
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