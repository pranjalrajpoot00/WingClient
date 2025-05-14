import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user.model';
import { Subscription, filter } from 'rxjs';

@Component({
    selector: 'app-manage-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-users.component.html',
    styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit, OnDestroy {
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
            this.filteredUsers = users;
        });
    }

    ngOnDestroy() {
        // Only clear edit mode if we're not navigating to add-user
        if (!this.router.url.includes('/planepage/admin/add-users')) {
            this.userService.clearEditMode();
        }
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
            // Set edit mode and wait for it to be set before navigating
            this.userService.setEditMode(index);
            // Add a small delay to ensure edit mode is set
            setTimeout(() => {
                this.router.navigate(['/planepage/admin/add-users']);
            }, 0);
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
