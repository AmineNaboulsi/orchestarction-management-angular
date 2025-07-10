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
import { TranslateModule } from '@ngx-translate/core';
import { KeycloakProfileService } from '../../../shared/services/keycloak/keycloak.service';
import { KeycloakProfile } from 'keycloak-js';
import { HeaderService } from '../../../shared/interceptors/HeaderService';

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
    ButtonShowHideFilterComponent,
    TranslateModule
],
  providers: [TaskBpmApiService],
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.css']
})
export class TicketsComponentPage implements OnInit {
  tasks: PagedResultTaskDto | undefined;
  loading = false;
  error = '';
  companyId : string = "";
  totalTasks = 0;
  currentPage = 0;
  pageSize = 10;
  sortOrder = 'ASC';
  showFilters = true;
  filter: TaskFilterDto = {
  };
  groupIdsString = '';
  userProfile: KeycloakProfile | null = null;
  userRoles: string[] = [];

  constructor(
    private keycloakProfileService: KeycloakProfileService,
    private headerService: HeaderService,
    private ticketsApi: TaskBpmApiService, 
    private router: Router) {}

  async ngOnInit() {
    // this.loadProfile();
    
  }
  
  loadProfile(): void {
    if (!this.keycloakProfileService.isAuthenticated()) {
      console.warn('User is not authenticated');
      alert('User is not authenticated')
      return;
    }

    this.loading = true;
    
    this.keycloakProfileService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.userRoles = this.keycloakProfileService.getUserRoles();
        this.loading = false;
        this.loadTasks();
      },
      error: (error) => {
        error = "Failed to load user not found"
        console.error('Failed to load user profile:', error);
        this.loading = false;
      }
    });
  }

  /**
   * 
   */
  loadTasks() {
    const companyIdArray = this.userProfile?.attributes?.["companyId"];
    const campanyId = Array.isArray(companyIdArray) ? companyIdArray[0] : undefined;
    this.loading = true;
    this.error = '';
    const groupIds = this.groupIdsString.trim() 
      ? this.groupIdsString.split(',').map(id => id.trim()).filter(id => id)
      : undefined;
    const searchRequest: PagedRequestTaskFilterDto = {
      size: this.pageSize,
      page: this.currentPage,
      filter: {
        tenantId : campanyId,
        ...this.filter,
        groupIds: groupIds 
      },
    };
    this.ticketsApi.searchTasks(
      this.headerService.getRequestId() ,
      this.headerService.getCanalId() ,
      searchRequest).subscribe({
        next: (response: any) => {
          this.tasks = response.body;
          this.totalTasks = this.tasks?.entities?.length || 0;
          this.loading = false;
        },
        error: (err: any) => {
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