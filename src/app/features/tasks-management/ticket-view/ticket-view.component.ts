import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseTaskDto, TaskBpmApiService, TaskDto } from '../../../services/generated/api-client';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';

@Component({
  selector: 'app-ticket-view',
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

  loadTaskById(taskId: string): void {
    this.loading = true;
    this.error = null;
    this.task = undefined;

    this.taskBpmApi.getTaskById('', '', taskId).subscribe({
      next: (response: ApiResponseTaskDto) => {
        this.task = response.body || undefined;
        this.loading = false;
      },
      error: (err) => {
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