import { DatePipe, NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';
import { AddCommentRequestDto, ApiResponseCommentDto, ApiResponseTaskDto, CommentDto, TaskBpmApiService, TaskDto } from '../../../services/generated/api-client';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HeaderService } from '../../../shared/interceptors/HeaderService';
import { FormsModule, NgModel } from '@angular/forms';
import { SimpleLoadingMiniComponent } from "../../../shared/component/loading/simple-loading-mini/simple-loading-mini.component";

interface TaskEvent {
  id: string;
  taskId: string;
  eventType: string;
  description: string;
  userId: string | null;
  userDisplayName: string | null;
  timestamp: string;
  formattedTime: string | null;
  eventData: any;
}

interface Comment {
  CommentId: string;
  CommentInfo: {
    userId: string;
    time: string;
    taskId: string;
    processInstanceId: string;
    type: string | null;
    fullMessage: string;
  };
}

interface TaskHistory {
  taskId: string;
  auditEvents: TaskEvent[];
  comments: Comment[];
  totalComments: number;
  totalEvents: number;
  lastActivity: string | null;
}

@Component({
  selector: 'app-ticket-view',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ToastModule,
    BreadcrumbNavigationComponent, MatProgressSpinnerModule, ConfirmDialogModule, MatIconModule, FormsModule, SimpleLoadingMiniComponent],
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
})
export class TicketViewComponent implements OnInit {
  taskId: string | null = null;
  task: TaskDto | undefined;
  loading = false;
  error: string | null = null;
  isLoading = false;

  newComment: string = '';
  isAddingComment: boolean = false;
  showCommentSection: boolean = true;
  hasHistory: boolean = false;
  comments: Comment[] = [];
  taskHistory: TaskHistory | null = null;
  historyLoading = false;
  constructor(
    private taskBpmApi: TaskBpmApiService,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  addComment(){
    this.isAddingComment = true;
    this.taskBpmApi.addComment(
      this.headerService.getRequestId(), 
      this.headerService.getCanalId(),
      this.taskId || '',{ 
          message: this.newComment,
          type: 'info'
      }
    ).subscribe(
      {
        next : (reponse :ApiResponseCommentDto) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Info', 
            detail: 'Comment Added'
          });
          this.loadTaskHistory(this.taskId || '');
          this.isAddingComment = false;
        },
        error :(err) => {
          console.log({
            err : err
          })
          this.isAddingComment = false;
        },
      }
    )
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.loadTaskById(this.taskId);
      this.loadTaskHistory(this.taskId);
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  /**
   * Load task history including audit events and comments
   */
  loadTaskHistory(taskId: string): void {
    this.historyLoading = true;
    
    // Replace with your actual API call for task history
    this.taskBpmApi.getTaskHistory('', '', taskId).subscribe({
      next: (response: any) => {
        this.taskHistory = response.body;
        this.comments = this.taskHistory?.comments || [];
        this.hasHistory = (this.taskHistory?.auditEvents?.length || 0) > 0 || (this.taskHistory?.comments?.length || 0) > 0;
        this.historyLoading = false;
      },
      error: (err) => {
        console.error('Error loading task history:', err);
        this.historyLoading = false;
        this.messageService.add({ 
          severity: 'info', 
          summary: 'Aucune donnée', 
          detail: 'Aucune information disponible pour cette tâche.'
        });
      }
    });
  }

  /**
   * Get icon for different event types
   */
  getEventIcon(eventType: string): string {
    switch (eventType) {
      case 'TASK_CREATED':
        return 'add_circle';
      case 'TASK_ASSIGNED':
        return 'person_add';
      case 'TASK_COMPLETED':
        return 'check_circle';
      case 'CANDIDATE_ADDED':
        return 'group_add';
      case 'CANDIDATE_REMOVED':
        return 'group_remove';
      case 'TASK_UNASSIGNED':
        return 'person_remove';
      default:
        return 'history';
    }
  }

  /**
   * Get CSS classes for different event types
   */
  getEventClasses(eventType: string): { container: string, avatar: string, icon: string, badge: string } {
    switch (eventType) {
      case 'TASK_CREATED':
        return {
          container: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200',
          avatar: 'bg-blue-600',
          icon: 'text-blue-600',
          badge: 'text-blue-700'
        };
      case 'TASK_ASSIGNED':
        return {
          container: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          avatar: 'bg-green-600',
          icon: 'text-green-600',
          badge: 'text-green-700'
        };
      case 'TASK_COMPLETED':
        return {
          container: 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200',
          avatar: 'bg-purple-600',
          icon: 'text-purple-600',
          badge: 'text-purple-700'
        };
      case 'CANDIDATE_ADDED':
        return {
          container: 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200',
          avatar: 'bg-orange-600',
          icon: 'text-orange-600',
          badge: 'text-orange-700'
        };
      default:
        return {
          container: 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200',
          avatar: 'bg-gray-600',
          icon: 'text-gray-600',
          badge: 'text-gray-700'
        };
    }
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(userId: string | null): string {
    if (!userId) return '?';
    return userId.substring(0, 2).toUpperCase();
  }

  /**
   * Get event type display name
   */
  getEventTypeDisplay(eventType: string): string {
    switch (eventType) {
      case 'TASK_CREATED':
        return 'Création';
      case 'TASK_ASSIGNED':
        return 'Affectation';
      case 'TASK_COMPLETED':
        return 'Completion';
      case 'CANDIDATE_ADDED':
        return 'Candidat ajouté';
      case 'CANDIDATE_REMOVED':
        return 'Candidat retiré';
      case 'TASK_UNASSIGNED':
        return 'Désaffectation';
      default:
        return 'Modification';
    }
  }
  
  /**
   * 
   * @param taskId 
   * @returns 
   */
  confirmeCompletion(taskId: string | undefined){
    if (!taskId) {
        alert('Invalid task ID');
        return;
    }
    this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Are you sure you want to complete this task ?',
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
                this.completeTask()
            }
        });
  }

  completeTask() {
    this.isLoading = true;
    this.taskBpmApi.completeTask(
      this.headerService.getRequestId() ,
      this.headerService.getCanalId() ,
      this.taskId || '', {
      Variables: {}
    }).subscribe({
      next: (response: ApiResponseTaskDto) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: response?.message
        });
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error: (er) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error ', 
          detail: er?.error?.message 
        });
        this.isLoading = false;
      },
    });
  }

  loadTaskById(taskId: string): void {
    this.loading = true;
    this.error = null;
    this.task = undefined;

    this.taskBpmApi.getTaskById('', '', taskId).subscribe({
      next : (response: ApiResponseTaskDto) =>{
        this.task = response.body || undefined;
        
        this.loading = false;
      },
      error: (err)=> {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: err
            });
        console.error('Error loading task:', err);
      }
    });
  }

  retry(): void {
    if (this.taskId) {
      this.loadTaskById(this.taskId);
    }
  }

  getShortTaskId(taskId: string): string {
    return taskId.substring(0, 8);
  }
}