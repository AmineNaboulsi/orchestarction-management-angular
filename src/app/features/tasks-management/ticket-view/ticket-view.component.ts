import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';
import { ApiResponseTaskDto, TaskBpmApiService, TaskDto } from '../../../services/generated/api-client';

@Component({
  selector: 'app-ticket-view',
  standalone: true,
  imports: [NgIf, DatePipe, BreadcrumbNavigationComponent],
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent implements OnInit {
  taskId: string | null = null;
  task: TaskDto | undefined;
  loading = false;
  error: string | null = null;

  constructor(
    private taskBpmApi: TaskBpmApiService,
    private route: ActivatedRoute,
    private router: Router
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
    this.taskBpmApi.completeTask("", "", taskId, {
      Variables: {}
    }).subscribe({
      next: (response :any) => {
        alert('Task completed successfully!');
      },
      error: (err :any) => {
        console.error('Error completing task', err);
        alert('Failed to complete task. Please try again.');
      }
    });
  }


  loadTaskById(taskId: string): void {
    this.loading = true;
    this.error = null;
    this.task = undefined;

    this.taskBpmApi.getTaskById('', '', taskId).subscribe({
      next: (response: ApiResponseTaskDto) => {
        this.task = response.body || undefined;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load task details. Please try again.';
        this.loading = false;
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