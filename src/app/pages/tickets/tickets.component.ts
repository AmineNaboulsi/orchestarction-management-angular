import { Component, OnInit } from '@angular/core';
import { PagedRequestTaskFilterDto, PagedResultTaskDto, TaskBpmApiService, TaskFilterDto } from '../../api-client';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  imports: [NgFor, NgIf, FormsModule, DatePipe],
  providers: [TaskBpmApiService],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tasks: PagedResultTaskDto | undefined;
  loading = false;
  error = '';

  currentPage = 0;
  pageSize = 10;
  sortOrder = 'ASC';
  
  showFilters = false;
  filter: TaskFilterDto = {};
  
  groupIdsString = '';

  constructor(private ticketsApi: TaskBpmApiService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.error = '';
    const groupIds = this.groupIdsString.trim() 
      ? this.groupIdsString.split(',').map(id => id.trim()).filter(id => id)
      : undefined;
    const searchRequest: PagedRequestTaskFilterDto = {
      size: this.pageSize,
      page: this.currentPage,
      filter: {
        ...this.filter,
        groupIds: groupIds
      }
    };
    
     this.ticketsApi.searchTasks("", "", searchRequest).subscribe({
      next: (response) => {
        this.tasks = response.body;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks', err);
        this.error = 'Failed to load tasks. Please try again.';
        this.loading = false;
      }
    });

  }

  completeTask(taskId: string | undefined) {
    if (!taskId) {
        alert('Invalid task ID');
        return;
    }
    if (!confirm('Are you sure you want to complete this task?')) {
      return;
    }
    this.ticketsApi.completeTask("", "", taskId, {
      Variables: {}
    }).subscribe({
      next: (response) => { //Who cares 
        alert('Task completed successfully!');
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error completing task', err);
        alert('Failed to complete task. Please try again.');
      }
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    this.currentPage = 0; // Reset to first page when applying filters
    this.loadTasks();
  }

  clearFilters() {
    this.filter = {};
    this.groupIdsString = '';
    this.currentPage = 0;
    this.loadTasks();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.getTotalPages()) {
      this.currentPage = page;
      this.loadTasks();
    }
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages() - 1) {
      this.currentPage++;
      this.loadTasks();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTasks();
    }
  }

  getTotalPages(): number {
    return this.tasks?.totalPages || 0;
  }

  getTotalElements(): number {
    return this.tasks?.totalElements || 0;
  }

  changeSortOrder() {
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.loadTasks();
  }

  changePageSize() {
    this.currentPage = 0;
    this.loadTasks();
  }
}