import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-teamlead-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teamlead-dashboard.component.html',
  styleUrl: './teamlead-dashboard.component.css'
})
export class TeamleadDashboardComponent implements OnInit {
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

  navigateToTaskManagement() {
    this.router.navigate(['/planepage/select-project'], {
      state: { navigateToTaskManagement: true }
    });
  }

  navigateToProjectStatus() {
    this.router.navigate(['/planepage/select-project'], {
      state: { navigateToAnalysis: true }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/planepage/my-profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
