import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ProcessFilterDto } from '../../../services/generated/api-client';

@Component({
  selector: 'app-process-filter-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './process-filter-form.component.html',
  styleUrl: './process-filter-form.component.css'
})

export class ProcessFilterFormComponent implements OnInit {

  @Input() filter: ProcessFilterDto = {};

  @Output() ClearFilters = new EventEmitter<PageEvent>();
  @Output() Search = new EventEmitter<PageEvent>();
  processInstanceIdsInput: string = '';


  updateProcessInstanceIds() {
    if (this.processInstanceIdsInput.trim()) {
      // Convert comma-separated string to array
      this.filter.processInstanceIds = this.processInstanceIdsInput
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
    } else {
      this.filter.processInstanceIds = [];
    }
  }
  
  ngOnInit(): void {
    if (this.filter.processInstanceIds && this.filter.processInstanceIds.length > 0) {
      this.processInstanceIdsInput = this.filter.processInstanceIds.join(', ');
    }
  }
  clearFilters() {
    this.ClearFilters.emit();
  }
  applyFilters() {
    this.Search.emit();
  }
}
