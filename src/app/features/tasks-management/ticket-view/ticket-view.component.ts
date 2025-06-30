import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseTaskDto, TaskBpmApiService, TaskDto } from '../../../services/generated/api-client';

@Component({
  selector: 'app-ticket-view',
  imports: [NgIf, DatePipe],
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent implements OnInit {
  taskId: string | null = null;
  task: TaskDto | undefined;

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
    this.taskBpmApi.getTaskById('', '', taskId).subscribe({
      next: (response: ApiResponseTaskDto) => {
        this.task = response.body || undefined;
      },
      error: (err) => {
        console.error('Error loading task:', err);
      }
    });
  }
}