import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {}

  navigateToManageUsers() {
    this.router.navigate(['/planepage/admin-dashboard/manage-users']);
  }

  navigateToAddUser() {
    this.userService.clearEditMode();
    this.router.navigate(['/planepage/admin-dashboard/add-users']);
  }

  navigateToActivityMonitoring() {
    this.router.navigate(['/planepage/admin-dashboard/activity-monitoring']);
  }
}
