import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AddUserComponent } from '../add-user/add-user.component';
import { ActivityMonitoringComponent } from '../activity-monitoring/activity-monitoring.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AddUserComponent,
    ActivityMonitoringComponent,
    ManageUsersComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToManageUsers() {
    this.router.navigate(['/planepage/admin/manage-users']);
  }

  navigateToAddUser() {
    this.router.navigate(['/planepage/admin/add-users']);
  }

  navigateToActivityMonitoring() {
    this.router.navigate(['/planepage/admin/activity-monitoring']);
  }
}
