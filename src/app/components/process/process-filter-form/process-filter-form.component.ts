import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ProcessFilterDto } from '../../../services/generated/api-client';

@Component({
  selector: 'app-process-filter-form',
  standalone:true,
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
