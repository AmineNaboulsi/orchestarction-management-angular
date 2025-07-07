import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgFor, NgIf,  } from '@angular/common';
import { PagedResultProcessDto, ProcessBpmApiService } from '../../../services/generated/api-client';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-process-table',
  standalone: true,
  imports: [NgFor,NgIf , DatePipe, MatIconModule, ToastModule, ConfirmDialogModule],
  templateUrl: './process-table.component.html',
  styleUrl: './process-table.component.css'
})
export class ProcessTableComponent { 
  @Input() processes:PagedResultProcessDto| undefined;
  @Output() enventHandlerRefresh = new EventEmitter<String>();
  @Input() loading = true ;
  @Input() error = '';
  
  
  constructor(
    private confirmationService: ConfirmationService,
    private processService: ProcessBpmApiService, private router :Router) {}

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
    this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Are you sure you want to cancel this process?',
            icon: 'pi pi-exclamation-circle',
            rejectButtonProps: {
                label: 'Cancel',
                icon: 'pi pi-times',
                outlined: true,
                size: 'small'
            },
            acceptButtonProps: {
                label: 'Save',
                icon: 'pi pi-check',
                size: 'small'
            },
            accept: () => {
                this.loading = true;
                this.processService.cancelProcess("","",processInstanceId).subscribe({
                  next: () => {
                    this.enventHandlerRefresh.emit();
                  },
                  error: (err) => {
                    this.error = 'Failed to cancel process. Please try again.';
                    this.loading = false;
                    console.error(err);
                  }
                });
            }
        });
  }

  PauseProcess(processInstanceId: string){
    if (confirm('Are you sure you want to pause this process?')) {
      this.loading = true;
      this.processService.stopProcess("","",processInstanceId).subscribe({
        next: () => {
          this.enventHandlerRefresh.emit();
        },
        error: (err) => {
          this.error = 'Failed to pause process. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
  ResumeProcess(processInstanceId: string){
    if (confirm('Are you sure you want to resume this process?')) {
      this.loading = true;
      this.processService.resumeProcess("","",processInstanceId).subscribe({
        next: () => {
          this.enventHandlerRefresh.emit();
        },
        error: (err) => {
          this.error = 'Failed to resume process. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
