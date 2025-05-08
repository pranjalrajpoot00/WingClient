import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  constructor(private router: Router) {}
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.username && this.password) {
      // In a real application, you would handle authentication here
      console.log('Login credentials submitted:', {
        username: this.username,
        password: this.password
      });
      if(this.username == "admin00" && this.password == "Admin@123")
        this.router.navigate(['/manage-users']);
      else if(this.username == "pm00" && this.password == "PM@123")
        this.router.navigate(['/dashboard']);
      else
      alert('Invalid Credentials.');
    } 
    else {
      alert('Please enter both username and password.');
    }
  }
  logout(): void {
    console.log('Logging out...');
  }
}
