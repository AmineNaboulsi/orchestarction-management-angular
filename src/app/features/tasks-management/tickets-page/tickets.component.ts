import { Component, OnInit } from '@angular/core';
import { PagedRequestTaskFilterDto, PagedResultTaskDto, TaskBpmApiService, TaskFilterDto } from '../../../services/generated/api-client';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';

@Component({
  selector: 'app-tickets-page',
  imports: [NgFor, NgIf, FormsModule, DatePipe, NgClass, BreadcrumbNavigationComponent],
  providers: [TaskBpmApiService],
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.css']
})
export class TicketsComponentPage implements OnInit {
  tasks: PagedResultTaskDto | undefined;
  loading = false;
  error = '';

  currentPage = 0;
  pageSize = 10;
  sortOrder = 'ASC';
  
  showFilters = true;
  filter: TaskFilterDto = {};
  
  groupIdsString = '';

  constructor(private ticketsApi: TaskBpmApiService, private router: Router) {}

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
      },

    };
    
     this.ticketsApi.searchTasks("", "", searchRequest).subscribe({
      next: (response :any) => {
        this.tasks = response.body;
        this.loading = false;
      },
      error: (err :any) => {
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
      next: (response :any) => {
        alert('Task completed successfully!');
        console.log(response)
        this.loadTasks();
      },
      error: (err :any) => {
        console.error('Error completing task', err);
        alert('Failed to complete task. Please try again.');
      }
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    this.currentPage = 0; 
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

  viewTask(taskId :string){
    if (taskId) {
      this.router.navigate(['/tasks/view', taskId]);
    }
  }

  getPriorityClass(priority: number | undefined): string {
    if (!priority) return 'bg-gray-100 text-gray-800';
    
    if (priority >= 80) return 'bg-red-100 text-red-800';
    if (priority >= 50) return 'bg-orange-100 text-orange-800';
    if (priority >= 25) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  }

  getPriorityLabel(priority: number | undefined): string {
    if (!priority) return 'Non défini';
    
    if (priority >= 80) return `Haute (${priority})`;
    if (priority >= 50) return `Moyenne (${priority})`;
    if (priority >= 25) return `Basse (${priority})`;
    return `Très basse (${priority})`;
  }

  createNewTask(){
    this.router.navigate([
      '/tasks/create'
    ])
  }

  editTask(taskId :string){
    if (taskId) {
      this.router.navigate(['/tasks/edit', taskId]);
    }
  }
}