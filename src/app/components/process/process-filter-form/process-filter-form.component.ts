import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProcessFilterDto } from '../../../services/generated/api-client';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-process-filter-form',
  imports: [FormsModule],
  templateUrl: './process-filter-form.component.html',
  styleUrl: './process-filter-form.component.css'
})

export class ProcessFilterFormComponent {
  @Input() filter: ProcessFilterDto = {};
  
  @Output() ClearFilters = new EventEmitter<PageEvent>();
  @Output() Search = new EventEmitter<PageEvent>();
  
  clearFilters(){
    this.ClearFilters.emit();
  }
  applyFilters(){
    this.Search.emit();
  }
}
