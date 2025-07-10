import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-button-show-hide-filter',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './button-show-hide-filter.component.html',
  styleUrl: './button-show-hide-filter.component.css'
})
export class ButtonShowHideFilterComponent {
  @Output() toggleFilters = new EventEmitter<boolean>();
  showFilters = true;

  
  toggleFiltersState() {
    this.showFilters = !this.showFilters;
    this.toggleFilters.emit(this.showFilters);
  }
}
