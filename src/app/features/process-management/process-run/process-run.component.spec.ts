import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessRunComponent } from './process-run.component';

describe('ProcessRunComponent', () => {
  let component: ProcessRunComponent;
  let fixture: ComponentFixture<ProcessRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessRunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
