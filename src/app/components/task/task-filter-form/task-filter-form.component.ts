import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFilterDto } from '../../../services/generated/api-client';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-task-filter-form',
  imports: [FormsModule],
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
