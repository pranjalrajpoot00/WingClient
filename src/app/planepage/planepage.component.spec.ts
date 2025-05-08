import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanepageComponent } from './planepage.component';

describe('PlanepageComponent', () => {
  let component: PlanepageComponent;
  let fixture: ComponentFixture<PlanepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
