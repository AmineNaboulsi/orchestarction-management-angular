import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFilterFormComponent } from './process-filter-form.component';

describe('ProcessFilterFormComponent', () => {
  let component: ProcessFilterFormComponent;
  let fixture: ComponentFixture<ProcessFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessFilterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
