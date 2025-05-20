import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user.model';
import { Subscription } from 'rxjs';

// Define the form data interface without ID
interface UserFormData {
  name: string;
  username: string;
  password: string | undefined;
  role: string;
  department: string;
  reportingMgr?: number;
  email?: string;
  phoneNumber?: string;
  customRole?: string;
  reportsTo?: string;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddUserComponent implements OnInit, OnDestroy {
  user: UserFormData = {
    name: '',
    username: '',
    password: '',
    role: '',
    department: 'IDCC',
    reportsTo: ''
  };
  showSuccessModal = false;
  isEditing = false;
  editIndex = -1;
  showCustomRole = false;
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  showUserList: boolean = false;
  isPasswordLocked = true;
  private originalUser: User | undefined;
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
          this.originalUser = { ...userToEdit };
          const { id, password, ...userWithoutIdAndPassword } = userToEdit;
          this.user = { 
            ...userWithoutIdAndPassword, 
            password: '',
            department: userToEdit.department || 'IDCC',
            reportsTo: this.getManagerName(userToEdit.reportingMgr)
          };
          this.showCustomRole = this.user.role === 'other';
          this.isPasswordLocked = true;
        }
      } else {
        this.resetForm();
      }
    });
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
      this.filteredUsers = users;
    });
  }

  getManagerName(managerId: number | undefined): string {
    if (!managerId) return '';
    const manager = this.allUsers.find(user => user.id === managerId);
    return manager ? manager.name : '';
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.showUserList = true;
    
    if (this.searchQuery.trim()) {
      this.filteredUsers = this.allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            user.username.toLowerCase().includes(this.searchQuery.toLowerCase());
        if (this.isEditing && this.editIndex !== -1) {
          const currentUser = this.userService.getUserByIndex(this.editIndex);
          return matchesSearch && user.id !== currentUser?.id;
        }
        return matchesSearch;
      });
    } else {
      if (!this.isEditing) {
        this.filteredUsers = this.allUsers;
      } else {
        const currentUser = this.userService.getUserByIndex(this.editIndex);
        this.filteredUsers = this.allUsers.filter(user => user.id !== currentUser?.id);
      }
    }
  }

  selectUser(user: User) {
    this.user.reportsTo = user.name;
    this.user.reportingMgr = user.id;
    this.searchQuery = user.name;
    this.showUserList = false;
  }

  onSearchBlur() {
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
      this.user.password = '';
    }
  }

  onSubmit() {
    if (this.isEditing) {
      if (this.user.role === 'other' && this.user.customRole) {
        this.user.role = this.user.customRole;
      }

      if (this.isPasswordLocked && this.originalUser) {
        this.user.password = this.originalUser.password;
      } else if (!this.user.password) {
        alert('Please enter a new password or lock the password field');
        return;
      }

      this.userService.editUser(this.editIndex, this.user);
    } else {
      if (this.user.role === 'other' && this.user.customRole) {
        this.user.role = this.user.customRole;
      }
      this.userService.addUser(this.user);
    }

    this.showSuccessModal = true;
  }

  closeModal() {
    this.showSuccessModal = false;
    if (this.isEditing) {
      this.router.navigate(['/manage-users']);
    } else {
      this.resetForm();
    }
  }

  addAnotherUser() {
    this.resetForm();
  }

  resetForm() {
    this.user = { 
      name: '', 
      username: '', 
      password: '', 
      role: '', 
      department: 'IDCC',
      reportsTo: '' 
    };
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



