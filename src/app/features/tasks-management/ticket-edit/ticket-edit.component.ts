import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbNavigationComponent } from '../../../shared/component/breadcrumb-navigation/breadcrumb-navigation.component';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApiResponseListTaskDto, ApiResponseListUserDto, ApiResponseString, ApiResponseTaskDto, TaskBpmApiService, TaskDto, TaskUpdate, UserBpmnApiService, UserDto } from '../../../services/generated/api-client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HeaderService } from '../../../shared/interceptors/HeaderService';
import { SimpleLoadingMiniComponent } from "../../../shared/component/loading/simple-loading-mini/simple-loading-mini.component";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-ticket-edit',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    TranslateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ToastModule,
    ConfirmDialogModule,
    BreadcrumbNavigationComponent,
    SimpleLoadingMiniComponent
  ],
  templateUrl: './ticket-edit.component.html',
  styleUrl: './ticket-edit.component.css'
})
export class TicketEditComponent implements OnInit {

  taskId: string | null = null;
  task: TaskDto | undefined;
  editForm: FormGroup;
  loading = false;
  error: string | null = null;
  info: string | null = null;
  isSaving = false;
  users: Array<UserDto> | null = null;

  constructor(
    private taskBpmApi: TaskBpmApiService,
    private userBpmApi: UserBpmnApiService,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      assignee: [''],
      priority: [50],
      category: [''],
      description: [''],
      dueDate: [''] 
    });
  }
  get dueDate(): Date | null {
    return this.task?.TaskInfo?.dueDate ? new Date(this.task.TaskInfo?.dueDate) : null;
  }
  set dueDate(value: Date | null) {
    // Update due date when a new date is selected
    if (this.task) {
      const formattedDate = value ? value.toISOString() : null;
      // this.updateDueDate(formattedDate);
    }
  }
  clearDueDate() {

  }
  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.loadTaskById(this.taskId);
    }
    this.loadUsers();
  }

  Assign() {
    const assignee = this.editForm.get('assignee')?.value;
    console.log({
      editForm: this.editForm,
      assignee: assignee
    })
    if (!assignee || !this.taskId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Aucun assigné sélectionné ou ID de tâche manquant',
        life: 5000
      });
      return;
    }

    this.taskBpmApi.assignTasks(
      this.headerService.getRequestId(),
      this.headerService.getCanalId(),
      {
        assignments: [
          {
            taskId: this.taskId,
            userId: assignee
          }
        ]
      }
    ).subscribe({
      next: (response: ApiResponseListTaskDto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Assignation réussie',
          detail: `Tâche assignée à ${response?.body?.[0]?.TaskInfo?.assignee || assignee}`,
          life: 5000
        });
        // Update the task object to reflect the new assignee
        if (this.task && this.task.TaskInfo) {
          this.task.TaskInfo.assignee = assignee;
        }
      },
      error: (err) => {
        console.error('Assign error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec de l\'assignation de la tâche',
          life: 5000
        });
      }
    });
  }

  loadUsers() {
    this.userBpmApi.listUsers(
      this.headerService.getRequestId(),
      this.headerService.getCanalId(),
    ).subscribe(
      {
        next: (response: ApiResponseListUserDto) => {
          this.users = response?.body || null;
        },
        error: (err) => {
          console.error({
            err: err
          })
        },
      }
    )
  }

  loadTaskById(taskId: string): void {
    this.loading = true;
    this.error = null;
    this.task = undefined;

    this.taskBpmApi.getTaskById(
      this.headerService.getRequestId(),
      this.headerService.getCanalId(), taskId).subscribe({
        next: (response: ApiResponseTaskDto) => {
          if (response.status === '200' && response.body) {
            this.task = response.body;
            if (this.task) {
              this.populateForm();
            }
            this.loading = false;
          } else {
            this.handleNoTaskData();
          }
        },
        error: (err) => {
          this.loading = false;
          // this.handleTaskLoadError(err);
        }
      });
  }

  /**
 * Handle case where response is successful but no task data
 */
  private handleNoTaskData(): void {
    this.info = 'NO_DATA';
    this.loading = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Aucune donnée',
      detail: 'Aucune information disponible pour cette tâche.',
      life: 5000
    });
  }
  /**
   * Populate form with task data
   */
  populateForm(): void {
    if (!this.task?.TaskInfo) return;

    this.editForm.patchValue({
      name: this.task.TaskInfo.name || '',
      assignee: this.task.TaskInfo.assignee || '',
      priority: this.task.TaskInfo.priority || 50,
      category: this.task.TaskInfo.category || '',
      description: this.task.TaskInfo.description || '',
      dueDate: ''
    });
  }

  /**
   * Submit form and update task
   */
  onSubmit(): void {
    if (this.editForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulaire invalide',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.confirmationService.confirm({
      header: this.translateService?.instant('TASK.EDIT.CONFIRM_SAVE.HEADER'),
      message: this.translateService?.instant('TASK.EDIT.CONFIRM_SAVE.MESSAGE'),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Annuler',
        icon: 'pi pi-times',
        outlined: true,
        size: 'small'
      },
      acceptButtonProps: {
        label: 'Sauvegarder',
        icon: 'pi pi-check',
        size: 'small'
      },
      accept: () => {
        this.saveTask();
      }
    });
  }

  /**
   * Save task modifications
   */
  saveTask(): void {
    this.isSaving = true;
    const formData = this.editForm.value;

    const UpdatedTask: TaskUpdate = {
      ...this.task?.TaskInfo,
      id: this.task?.TaskID,
      name: formData.name,
      priority: parseInt(formData.priority),
      assignee : formData.assignee,
      category: formData.category,
      description: formData.description,
      dueDate: formData.dueDate || undefined
    };
    this.isSaving = false;
    console.log({
      UpdatedTask: UpdatedTask
    })
    this.taskBpmApi.updateTaskById(
      this.headerService.getRequestId(),
      this.headerService.getCanalId(),
      UpdatedTask
    ).subscribe({
      next : ( response?: ApiResponseString) => {
      this.messageService.add({
            severity: 'success',
            summary: 'Sucess',
            detail: response?.message ,
            life: 5000
          });
      },
      error : (err) =>  {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err,
            life: 5000
        });
      },
    })
    // if (this.editForm.get('assignee')?.value !== this.task?.TaskInfo?.assignee) {
    //   this.Assign()
    // }
  }

  /**
   * Navigate back to task list
   */
  goBack(): void {
    if (this.editForm.dirty) {
      this.confirmationService.confirm({
        header: this.translateService?.instant('TASK.EDIT.UNSAVED_CHANGES.HEADER'),
        message: this.translateService?.instant('TASK.EDIT.UNSAVED_CHANGES.MESSAGE'),
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: 'Rester',
          icon: 'pi pi-times',
          outlined: true,
          size: 'small'
        },
        acceptButtonProps: {
          label: 'Quitter',
          icon: 'pi pi-check',
          size: 'small'
        },
        accept: () => {
          this.router.navigate(['/tasks']);
        }
      });
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  /**
   * View task (navigate to view page)
   */
  viewTask(): void {
    this.router.navigate(['/tasks/view', this.taskId]);
  }


}

