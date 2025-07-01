import { Component, Input } from '@angular/core';
import { PagedResultProcessDto, ProcessBpmApiService } from '../../../services/generated/api-client';
import { Router } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-process-table',
  imports: [NgFor, DatePipe],
  templateUrl: './process-table.component.html',
  styleUrl: './process-table.component.css'
})
export class ProcessTableComponent { 
  @Input() processes:PagedResultProcessDto| undefined;
  @Input() loading = true ;
  @Input() error = '';
  
  
  constructor(private processService: ProcessBpmApiService, private router :Router) {}

  /**
   * 
   * @param processInstanceId 
   */
  viewDetails(processInstanceId: string){
    if(processInstanceId){
      this.router.navigate([
      'processes/view', processInstanceId
    ]);
    }
  }
  
  /**
   * Cancel process by Id
   * 
   * @param processInstanceId process Id
   */
  cancelProcess(processInstanceId: string) {
    if (confirm('Are you sure you want to cancel this process?')) {
      this.loading = true;
      this.processService.cancelProcess("","",processInstanceId).subscribe({
        next: () => {
          //this.loadProcesses();
        },
        error: (err) => {
          this.error = 'Failed to cancel process. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
