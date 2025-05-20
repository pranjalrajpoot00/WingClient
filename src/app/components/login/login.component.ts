import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  selectedRole: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.username && this.password && this.selectedRole) {
      if (this.authService.login(this.username, this.password, this.selectedRole)) {
        // Navigate based on role
        const user = this.authService.getCurrentUser();
        switch (user?.role) {
          case 'admin':
            this.router.navigate(['/planepage/admin-dashboard']);
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
          case 'tester':
          case 'other':
            this.router.navigate(['/planepage/dashboard']);
            break;
          default:
            this.router.navigate(['/planepage/dashboard']);
        }
      } else {
        alert('Invalid Credentials.');
      }
    } else {
      alert('Please enter Employee ID, select a role, and password.');
    }
  }
}
