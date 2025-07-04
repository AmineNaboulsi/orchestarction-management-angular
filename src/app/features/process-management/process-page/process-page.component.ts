import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';
import { PageEvent } from '@angular/material/paginator';
import { ProcessTableComponent } from "../../../components/process/process-table/process-table.component";
import { ButtonShowHideFilterComponent } from "../../../shared/component/filter/button-show-hide-filter/button-show-hide-filter.component";
import { ProcessFilterFormComponent } from "../../../components/process/process-filter-form/process-filter-form.component";
import { PagedRequestProcessFilterDto, PagedResultProcessDto, ProcessBpmApiService, ProcessFilterDto } from '../../../services/generated/api-client';
import { SimpleLoadingMiniComponent } from "../../../shared/component/loading/simple-loading-mini/simple-loading-mini.component";

@Component({
  selector: 'app-process-page',
  standalone: true,
  imports: [NgIf, FormsModule,
    BreadcrumbNavigationComponent,
    PaginationComponent, ProcessTableComponent, ButtonShowHideFilterComponent, ProcessFilterFormComponent, SimpleLoadingMiniComponent],
  templateUrl: './process-page.component.html',
  styleUrl: './process-page.component.css'
})
export class ProcessPageComponent {
  processes:PagedResultProcessDto| undefined;
  loading = false;
  error = '';
  totalProcess = 0;
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  sortOrder = 'ASC';
  showFilters = true;
  filter: ProcessFilterDto = {};
  
  constructor(private processService: ProcessBpmApiService, private router :Router) {}
  ngOnInit(): void { this.loadProcesses(); }

  /**
   * Load all Process instances current runing 
   * 
   */
  loadProcesses(){
    this.loading = true;
    this.error = "";

    const filterPayload:PagedRequestProcessFilterDto= {
      filter: {
        ...this.filter
      },
      page: this.currentPage,
      size: this.pageSize,
    };
    this.processService.listProcessInstances("","",filterPayload).subscribe({
      next: (response: any) => {
        this.processes = response.body;
        this.totalProcess = this.processes?.entities?.length || 0;
        this.loading = false;
      },
      error: (err :any) => {
        this.error = 'Failed to load processes. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  /**
   * 
   */
  EnventHandlerRefresh($event: String){
    this.loadProcesses()
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
  clearFilters() {
    this.filter = {};
    this.currentPage = 0;
    this.loadProcesses()
  }

  /**
   * 
   */
  runProcess(){
    this.router.navigate([
      '/process/run'
    ]);
  }

  /**
   * 
   */
  applyFilters() {
    this.currentPage = 0; 
    this.loadProcesses();
  }

  /**
   * 
   * @param event 
   */
  onPagination(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProcesses();
  }

  getTotalElements(): number {
    return this.processes?.totalElements || 0;
  }
  
}
