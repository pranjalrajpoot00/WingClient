import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';

@Component({
    selector: 'app-manage-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-users.component.html',
    styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    searchTerm: string = '';

    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.userService.getUsers().subscribe(users => {
            this.users = users;
            this.filteredUsers = users; // Initialize filtered users with all users
        });
    }

    filterUsers() {
        if (!this.searchTerm.trim()) {
            this.filteredUsers = this.users;
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredUsers = this.users.filter(user => 
                user.username.toLowerCase().startsWith(searchLower) ||
                user.name.toLowerCase().startsWith(searchLower)
            );
        }
    }

    editUser(user: User) {
        const index = this.users.findIndex(u => u.username === user.username);
        if (index !== -1) {
            this.userService.setEditMode(index);
            this.router.navigate(['/planepage/admin/add-users']);
        }
    }

    deleteUser(user: User) {
        if (confirm(`Are you sure you want to delete user: ${user.name}?`)) {
            const index = this.users.findIndex(u => u.username === user.username);
            if (index !== -1) {
                this.userService.deleteUser(index);
                // Update filtered users after deletion
                this.filterUsers();
            }
        }
    }

    logout() {
        console.log('Logging out...');
        this.router.navigate(['/login']);
    }
}
