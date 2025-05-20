import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddUserComponent implements OnInit, OnDestroy {
  user: User & { customRole?: string; reportsTo?: string } = {
    name: '',
    username: '',
    password: '',
    role: '',
    reportsTo: ''
  };
  showSuccessModal = false;
  isEditing = false;
  editIndex = -1;
  showCustomRole = false;
  allUsers: User[] = []; // Store all users
  filteredUsers: User[] = []; // Store filtered users for search
  searchQuery: string = ''; // Store search input
  showUserList: boolean = false; // Control visibility of user list
  isPasswordLocked = true; // Add this line
  private originalUser: User | undefined; // Store original user data
  private editModeSubscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    // Subscribe to edit mode changes
    this.editModeSubscription = this.userService.getEditMode().subscribe(mode => {
      this.isEditing = mode.isEditing;
      this.editIndex = mode.index;
      
      if (this.isEditing && this.editIndex !== -1) {
        const userToEdit = this.userService.getUserByIndex(this.editIndex);
        if (userToEdit) {
          // Store original user data
          this.originalUser = { ...userToEdit };
          // Create a copy without password for the form
          const { password, ...userWithoutPassword } = userToEdit;
          this.user = { ...userWithoutPassword, password: '' };
          this.showCustomRole = this.user.role === 'other';
          this.isPasswordLocked = true;
        }
      } else {
        this.resetForm();
      }
    });
  }

  ngOnInit() {
    // Load all users when component initializes
    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
      this.filteredUsers = users;
    });

    // Check if we're in edit mode when component initializes
    const currentMode = this.userService.getCurrentEditMode();
    if (currentMode.isEditing && currentMode.index !== -1) {
      const userToEdit = this.userService.getUserByIndex(currentMode.index);
      if (userToEdit) {
        this.user = { ...userToEdit };
        this.isEditing = true;
        this.editIndex = currentMode.index;
        this.showCustomRole = this.user.role === 'other';
      }
    } else {
      this.resetForm();
    }
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.showUserList = true;
    
    if (this.searchQuery.trim()) {
      // Filter out the current user if we're in edit mode
      this.filteredUsers = this.allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            user.username.toLowerCase().includes(this.searchQuery.toLowerCase());
        // If editing, don't show the current user in the list
        if (this.isEditing && this.editIndex !== -1) {
          const currentUser = this.userService.getUserByIndex(this.editIndex);
          return matchesSearch && user.username !== currentUser?.username;
        }
        return matchesSearch;
      });
    } else {
      // If not editing, show all users
      if (!this.isEditing) {
        this.filteredUsers = this.allUsers;
      } else {
        // If editing, show all users except the current user
        const currentUser = this.userService.getUserByIndex(this.editIndex);
        this.filteredUsers = this.allUsers.filter(user => user.username !== currentUser?.username);
      }
    }
  }

  selectUser(user: User) {
    // Store the selected user's name in reportsTo
    this.user.reportsTo = user.name;
    // Update the search query to show the selected name
    this.searchQuery = user.name;
    this.showUserList = false;
  }

  onSearchBlur() {
    // Delay hiding the list to allow for click events
    setTimeout(() => {
      this.showUserList = false;
    }, 200);
  }

  onRoleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.showCustomRole = select.value === 'other';
    if (!this.showCustomRole) {
      this.user.customRole = undefined;
    }
  }

  togglePasswordLock() {
    this.isPasswordLocked = !this.isPasswordLocked;
    if (this.isPasswordLocked) {
      // Clear the password field when locking
      this.user.password = '';
    }
  }

  onSubmit() {
    if (this.isEditing) {
      // If editing and role is 'other', use the custom role
      if (this.user.role === 'other' && this.user.customRole) {
        this.user.role = this.user.customRole;
      }
      // Ensure reportsTo is set from the search query if it exists
      if (this.searchQuery && !this.user.reportsTo) {
        this.user.reportsTo = this.searchQuery;
      }

      // Handle password update
      if (this.isPasswordLocked) {
        // If password is locked, keep the original hashed password
        if (this.originalUser) {
          this.user.password = this.originalUser.password;
        }
      } else {
        // If password is unlocked, it means admin wants to update the password
        // The new password will be hashed by the backend
        if (!this.user.password) {
          alert('Please enter a new password or lock the password field');
          return;
        }
        // Note: In a real application, the password would be hashed here or by the backend
        // For now, we'll just use the new password as is
      }

      this.userService.editUser(this.editIndex, this.user);
    } else {
      // If adding new user and role is 'other', use the custom role
      if (this.user.role === 'other' && this.user.customRole) {
        this.user.role = this.user.customRole;
      }
      // Ensure reportsTo is set from the search query if it exists
      if (this.searchQuery && !this.user.reportsTo) {
        this.user.reportsTo = this.searchQuery;
      }
      // Note: In a real application, the password would be hashed here or by the backend
      this.userService.addUser(this.user);
    }

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

  public resetForm() {
    this.user = { name: '', username: '', password: '', role: '', reportsTo: '' };
    this.originalUser = undefined;
    this.isEditing = false;
    this.editIndex = -1;
    this.showCustomRole = false;
    this.searchQuery = '';
    this.isPasswordLocked = true;
    this.userService.clearEditMode();
  }

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    if (this.editModeSubscription) {
      this.editModeSubscription.unsubscribe();
    }
  }
}



