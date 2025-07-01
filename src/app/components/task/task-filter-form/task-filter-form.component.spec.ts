import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFilterFormComponent } from './task-filter-form.component';

describe('TaskFilterFormComponent', () => {
  let component: TaskFilterFormComponent;
  let fixture: ComponentFixture<TaskFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFilterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
