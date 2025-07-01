import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonShowHideFilterComponent } from './button-show-hide-filter.component';

describe('ButtonShowHideFilterComponent', () => {
  let component: ButtonShowHideFilterComponent;
  let fixture: ComponentFixture<ButtonShowHideFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonShowHideFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonShowHideFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
