import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-developer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './developer-dashboard.component.html',
  styleUrl: './developer-dashboard.component.css'
})
export class DeveloperDashboardComponent implements OnInit {
  username: string = '';
  role: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username;
      this.role = currentUser.role;
    }
  }

  navigateToMyTasks() {
    this.router.navigate(['/planepage/task-management']);
  }

  navigateToMyProfile() {
    this.router.navigate(['/planepage/my-profile']);
  }

  navigateToTaskAnalysis() {
    this.router.navigate(['/planepage/task-analysis']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
