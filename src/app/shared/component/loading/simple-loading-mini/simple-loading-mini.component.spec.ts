import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleLoadingMiniComponent } from './simple-loading-mini.component';

describe('SimpleLoadingMiniComponent', () => {
  let component: SimpleLoadingMiniComponent;
  let fixture: ComponentFixture<SimpleLoadingMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleLoadingMiniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleLoadingMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
