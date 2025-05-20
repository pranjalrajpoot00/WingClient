import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  pageTitle = 'Dashboard';
  userName = 'Sagar';
  userRole = 'PM';
  currentUser: any = null;
  isProfileActive = false;
  private previousRoute: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userName = this.currentUser.username;
      this.userRole = this.currentUser.role;
    }
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  navigateToDashboard() {
    if (this.currentUser) {
      switch (this.currentUser.role) {
        case 'admin':
          this.router.navigate(['/planepage/admin']);
          break;
        case 'manager':
          this.router.navigate(['/planepage/manager-dashboard']);
          break;
        case 'teamlead':
          this.router.navigate(['/planepage/teamlead-dashboard']);
          break;
        case 'developer':
          this.router.navigate(['/planepage/developer-dashboard']);
          break;
        default:
          this.router.navigate(['/planepage']);
      }
    }
  }

  toggleProfile() {
    if (this.isProfileActive) {
      // If profile is active, return to previous route
      if (this.previousRoute) {
        this.router.navigate([this.previousRoute]);
      }
    } else {
      // Store current route before navigating to profile
      this.previousRoute = this.router.url;
      // Navigate to profile
      this.router.navigate(['/planepage/my-profile']);
    }
    this.isProfileActive = !this.isProfileActive;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
