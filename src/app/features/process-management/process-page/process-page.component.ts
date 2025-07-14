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
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-process-page',
  standalone: true,
  imports: [NgIf, FormsModule,
    BreadcrumbNavigationComponent,
    PaginationComponent, ProcessTableComponent, 
    ButtonShowHideFilterComponent, ProcessFilterFormComponent,
    SimpleLoadingMiniComponent, TranslateModule],
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
  
  constructor(private processService: ProcessBpmApiService,
    private messageService: MessageService,
    private router :Router) {}
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
        this.loading = false;
        console.error(err);
         this.messageService.add({
            severity: 'error',
            summary: 'Eror',
            detail: err,
            life: 5000 
          });
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
