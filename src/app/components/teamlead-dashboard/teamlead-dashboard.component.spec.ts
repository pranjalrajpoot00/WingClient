import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamleadDashboardComponent } from './teamlead-dashboard.component';

describe('TeamleadDashboardComponent', () => {
  let component: TeamleadDashboardComponent;
  let fixture: ComponentFixture<TeamleadDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamleadDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamleadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
