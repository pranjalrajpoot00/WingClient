import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddUserComponent implements OnInit, OnDestroy {
  user: User = {
    name: '',
    username: '',
    password: '',
    role: ''
  };
  showSuccessModal = false;
  isEditing = false;
  editIndex = -1;
  private editModeSubscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.editModeSubscription = this.userService.getEditMode().subscribe(mode => {
      this.isEditing = mode.isEditing;
      this.editIndex = mode.index;
      if (this.isEditing && this.editIndex !== -1) {
        const userToEdit = this.userService.getUserByIndex(this.editIndex);
        if (userToEdit) {
          this.user = { ...userToEdit };
        }
      }
    });
  }

  ngOnInit() {
    // Initialize component
  }

  ngOnDestroy() {
    if (this.editModeSubscription) {
      this.editModeSubscription.unsubscribe();
    }
  }

  // Switch between tabs
  activeTab = 'add'; // Default tab

  switchTab(tab: string) {
    // console.log(`${tab}`)
    this.router.navigate([`/${tab}`]);
    // In a real application, you would handle tab switching logic
}

  onSubmit() {
    if (this.isEditing) {
      this.userService.editUser(this.editIndex, this.user);
    } else {
      this.userService.addUser(this.user);
    }
    console.log(this.isEditing ? 'User updated:' : 'User added:', this.user);

    // Show success modal
    this.showSuccessModal = true;

    // After 2 seconds, reset form and close the modal
    setTimeout(() => {
      this.showSuccessModal = false;
      this.resetForm();
    }, 2000);
  }

  closeModal() {
    this.showSuccessModal = false;
  }

  addAnotherUser() {
    this.resetForm();
  }

  private resetForm() {
    this.user = { name: '', username: '', password: '', role: '' };
    this.isEditing = false;
    this.editIndex = -1;
    this.userService.clearEditMode();
  }

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
  }
}


