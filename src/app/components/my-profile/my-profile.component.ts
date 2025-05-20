import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, User } from '../../services/data.service';

interface UserProfile extends User {
  skillset: string;
  phoneNumber?: string;
}

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  isEditing: boolean = false;
  editedProfile: Partial<UserProfile> = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Get user details from DataService
      const users = this.dataService.getUsers();
      users.subscribe(usersList => {
        const userData = usersList.find(u => u.username === currentUser.username);
        if (userData) {
          this.profile = {
            ...userData,
            skillset: 'Angular, TypeScript, Node.js', // This will come from the database later
            phoneNumber: '+1234567890' // This will come from the database later
          };
        } else {
          // Fallback to basic user data if not found in DataService
          this.profile = {
            id: 1,
            username: currentUser.username,
            name: currentUser.username,
            role: currentUser.role,
            email: '',
            department: '',
            skillset: 'Angular, TypeScript, Node.js',
            phoneNumber: '+1234567890'
          };
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  startEditing() {
    if (this.profile) {
      this.editedProfile = {
        skillset: this.profile.skillset,
        email: this.profile.email,
        phoneNumber: this.profile.phoneNumber
      };
      this.isEditing = true;
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedProfile = {};
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveProfile() {
    if (!this.profile) return;

    // TODO: Replace with actual API call
    // Mock update for demonstration
    try {
      // Simulate API call
      setTimeout(() => {
        this.profile = {
          ...this.profile!,
          ...this.editedProfile
        };
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';
      }, 500);
    } catch (error) {
      this.errorMessage = 'Failed to update profile. Please try again.';
      this.successMessage = '';
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/planepage/developer-dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 