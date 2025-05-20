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
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.username && this.password) {
      if (this.authService.login(this.username, this.password)) {
        // Navigate based on role
        const user = this.authService.getCurrentUser();
        switch (user?.role) {
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
      } else {
        alert('Invalid Credentials.');
      }
    } else {
      alert('Please enter both username and password.');
    }
  }
}
