import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsComponentPage } from './tickets.component';


describe('TicketsComponent', () => {
  let component: TicketsComponentPage;
  let fixture: ComponentFixture<TicketsComponentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsComponentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
