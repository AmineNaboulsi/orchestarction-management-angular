import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';
import { PaginationComponent } from "../../../shared/component/pagination/pagination.component";
import { PageEvent } from '@angular/material/paginator';
import { TaskTableComponent } from "../../../components/task/task-table/task-table.component";
import { SimpleLoadingMiniComponent } from "../../../shared/component/loading/simple-loading-mini/simple-loading-mini.component";
import { TaskFilterFormComponent } from "../../../components/task/task-filter-form/task-filter-form.component";
import { ButtonShowHideFilterComponent } from "../../../shared/component/filter/button-show-hide-filter/button-show-hide-filter.component";
import { PagedRequestTaskFilterDto, PagedResultTaskDto, TaskBpmApiService, TaskFilterDto } from '../../../services/generated/api-client';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [
    NgIf, FormsModule,
    BreadcrumbNavigationComponent,
    PaginationComponent,
    TaskTableComponent,
    SimpleLoadingMiniComponent,
    TaskFilterFormComponent,
    ButtonShowHideFilterComponent
],
  providers: [TaskBpmApiService],
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.css']
})
export class TicketsComponentPage implements OnInit {
  tasks: PagedResultTaskDto | undefined;
  loading = false;
  error = '';
  totalTasks = 0;
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

  /**
   * 
   */
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
        this.totalTasks = this.tasks?.entities?.length || 0;
        this.loading = false;
      },
      error: (err :any) => {
        console.error('Error loading tasks', err);
        this.error = 'Failed to load tasks. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * 
   */
  toggleFilters(newFilterState: boolean) {
    this.showFilters = newFilterState;
  }

  /**
   * 
   */
  applyFilters() {
    this.currentPage = 0; 
    this.loadTasks();
  }

  /**
   * 
   */
  clearFilters() {
    this.filter = {};
    this.groupIdsString = '';
    this.currentPage = 0;
    this.loadTasks();
  }

  /**
   * 
   * @returns 
   */
  getTotalElements(): number {
    return this.tasks?.totalElements || 0;
  }

  /**
   * 
   * @param event 
   */
  onPagination(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTasks();
  }

  /**
   * 
   */
  createNewTask(){
    this.router.navigate([
      '/tasks/create'
    ])
  }

}