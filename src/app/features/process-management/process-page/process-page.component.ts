import { Component, OnInit } from '@angular/core';
import { PagedRequestProcessFilterDto, PagedResultProcessDto, ProcessBpmApiService, ProcessDto, ProcessFilterDto } from '../../../services/generated/api-client';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';

@Component({
  selector: 'app-process-page',
  imports: [NgFor, NgIf, FormsModule, DatePipe,BreadcrumbNavigationComponent],
  templateUrl: './process-page.component.html',
  styleUrl: './process-page.component.css'
})
export class ProcessPageComponent {
 processes:PagedResultProcessDto| undefined;
  loading = false;
  error = '';

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  sortOrder = 'ASC';
  
  showFilters = false;
  filter: ProcessFilterDto = {};
  constructor(private processService: ProcessBpmApiService, private router :Router) {}

  ngOnInit(): void {
    this.loadProcesses();
  }

  loadProcesses(){
    this.loading = true;
    this.error = "";

    const filterPayload:PagedRequestProcessFilterDto= {
      ...this.filter,
      page: this.currentPage,
      size: this.pageSize,
    };
    this.processService.listProcessInstances("","",filterPayload).subscribe({
      next: (response: any) => {
        this.processes = response.body;
        this.totalElements = response.totalElements || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load processes. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancelProcess(processInstanceId: string) {
    if (confirm('Are you sure you want to cancel this process?')) {
      this.loading = true;
      this.processService.cancelProcess("","",processInstanceId).subscribe({
        next: () => {
          this.loadProcesses();
        },
        error: (err) => {
          this.error = 'Failed to cancel process. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  clearFilters() {
    this.filter = {};
    this.currentPage = 0;
  }
  
  viewDetails(processInstanceId: string){
    if(processInstanceId){
      this.router.navigate([
      'processes/view', processInstanceId
    ]);
    }
  }
  runProcess(){
    this.router.navigate([
      '/process/run'
    ]);
  }

  applyFilters() {
    this.currentPage = 0; 
    this.loadProcesses();
  }

  changePageSize() {
    this.currentPage = 0;
    this.loadProcesses();
  }

  changeSortOrder() {
    this.loadProcesses();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProcesses();
    }
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages() - 1) {
      this.currentPage++;
      this.loadProcesses();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  getTotalElements(): number {
    return this.totalElements;
  }

}
