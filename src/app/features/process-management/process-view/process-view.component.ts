import { Component, OnInit } from '@angular/core';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';
import { ActivatedRoute } from '@angular/router';
import {
  ApiResponsePagedResultProcessHistoryDto,
  PagedRequestVoid,
  ProcessBpmApiService
} from '../../../services/generated/api-client';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { SimpleLoadingMiniComponent } from "../../../shared/component/loading/simple-loading-mini/simple-loading-mini.component";

@Component({
  selector: 'app-process-view',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe,
    BreadcrumbNavigationComponent, PaginationComponent, MatIconModule, SimpleLoadingMiniComponent],
  templateUrl: './process-view.component.html',
  styleUrls: ['./process-view.component.css']
})
export class ProcessViewComponent implements OnInit {
  processId: string | null = null;
  companyId: string | null = null;
  pageR: PagedRequestVoid = { 
    size: 10,
    page: 0,
    sort: 'ASC',
    filter: {
      tenantId : this.companyId
    }
};
  apiResponse: ApiResponsePagedResultProcessHistoryDto | null = null;

  constructor(
    private bpmnApiProcess: ProcessBpmApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.processId = this.route.snapshot.paramMap.get('id');
    if (this.processId) {
      this.loadProcessDetails(this.processId);
    }
  }

  loadProcessDetails(processInstanceId: string): void {
    this.bpmnApiProcess
      .getProcessHistory(
        'my-request-id',
        'my-canal',
        processInstanceId,
        this.pageR,
        'response'
      )
      .subscribe({
        next: (response) => {
          this.apiResponse = response.body;
        },
        error: (err) => {
          console.error('Error while loading process history:', err);
        }
      });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageR.page = event.pageIndex + 1;
    this.pageR.size = event.pageSize;
    
    if (this.processId) {
      this.loadProcessDetails(this.processId);
    }
  }

}
