import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMonitoringComponent } from './activity-monitoring.component';

describe('ActivityMonitoringComponent', () => {
  let component: ActivityMonitoringComponent;
  let fixture: ComponentFixture<ActivityMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
