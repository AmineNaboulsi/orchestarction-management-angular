import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PagedResultTaskDto, TaskBpmApiService } from '../../../services/generated/api-client';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [NgFor, DatePipe, NgClass, TranslateModule],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.css'
})
export class TaskTableComponent {
  @Input() tasks : PagedResultTaskDto | undefined;
  
  constructor(private router: Router, private ticketsApi: TaskBpmApiService){}
 
  /**
   * 
   * @param taskId 
   */
  editTask(taskId :string){
    if (taskId) {
      this.router.navigate(['/tasks/edit', taskId]);
    }
  }

  /**
   * 
   * @param priority 
   * @returns 
   */
  getPriorityClass(priority: number | undefined): string {
    if (!priority) return 'bg-gray-100 text-gray-800';
    
    if (priority >= 80) return 'bg-red-100 text-red-800';
    if (priority >= 50) return 'bg-orange-100 text-orange-800';
    if (priority >= 25) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  }

  /**
   * 
   * @param priority 
   * @returns 
   */
  getPriorityLabel(priority: number | undefined): string {
    if (!priority) return 'Non défini';
    
    if (priority >= 80) return `Haute (${priority})`;
    if (priority >= 50) return `Moyenne (${priority})`;
    if (priority >= 25) return `Basse (${priority})`;
    return `Très basse (${priority})`;
  }

  /**
   * 
   * @param taskId 
   */
  viewTask(taskId :string){
    if (taskId) {
      this.router.navigate(['/tasks/view', taskId]);
    }
  }
  
}
