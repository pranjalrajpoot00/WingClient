import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user.model';
import { Subscription } from 'rxjs';

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
    private usersSubscription: Subscription;

    constructor(
        private router: Router,
        private userService: UserService
    ) {
        this.usersSubscription = this.userService.getUsers().subscribe(users => {
            this.users = users;
            this.filterUsers();
        });
    }

    ngOnInit() {
        // Initial filter
        this.filterUsers();
    }

    ngOnDestroy() {
        if (this.usersSubscription) {
            this.usersSubscription.unsubscribe();
        }
        // Only clear edit mode if we're not navigating to add-user
        if (!this.router.url.includes('/add-users')) {
            this.userService.clearEditMode();
        }
    }

    filterUsers() {
        if (!this.searchTerm.trim()) {
            this.filteredUsers = [...this.users];
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredUsers = this.users.filter(user => 
                user.name.toLowerCase().includes(searchLower) ||
                user.username.toLowerCase().includes(searchLower)
            );
        }
    }

    getManagerName(managerId: number | undefined): string {
        if (!managerId) return '';
        const manager = this.users.find(user => user.id === managerId);
        return manager ? manager.name : '';
    }

    getUserIndex(user: User): number {
        return this.users.findIndex(u => u.id === user.id);
    }

    editUser(index: number) {
        this.userService.setEditMode(true, index);
        this.router.navigate(['/planepage/admin-dashboard/add-users']);
    }

    deleteUser(user: User) {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            const index = this.getUserIndex(user);
            if (index !== -1) {
                this.userService.deleteUser(index);
            }
        }
    }

    logout() {
        console.log('Logging out...');
        this.router.navigate(['/login']);
    }
}
