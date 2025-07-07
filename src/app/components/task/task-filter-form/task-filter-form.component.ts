import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TaskFilterDto } from '../../../services/generated/api-client';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-filter-form',
  standalone:true,
  imports: [FormsModule,TranslateModule],
  templateUrl: './task-filter-form.component.html',
  styleUrl: './task-filter-form.component.css'
})
export class TaskFilterFormComponent {
  @Input() filter: TaskFilterDto = {};
  @Input() groupIdsString = '';

  @Output() ClearFilters = new EventEmitter<PageEvent>();
  @Output() Search = new EventEmitter<PageEvent>();
  
  clearFilters(){
    this.ClearFilters.emit();
  }
  applyFilters(){
    this.Search.emit();
  }
}
