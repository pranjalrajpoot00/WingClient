import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';

@Component({
    selector: 'app-manage-users',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './manage-users.component.html',
    styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {
    users: User[] = [];

    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.userService.getUsers().subscribe(users => {
            this.users = users;
        });
    }

    navigateTo(page: string) {
        console.log(`Navigating to ${page} page...`);
        this.router.navigate([`/${page}`]);
    }

    switchTab(tab: string) {
        console.log(`${tab}`);
        this.router.navigate([`/${tab}`]);
    }

    editUser(user: User) {
        const index = this.users.findIndex(u => u.username === user.username);
        if (index !== -1) {
            this.userService.setEditMode(index);
            this.router.navigate(['/add-users']);
        }
    }

    deleteUser(user: User) {
        if (confirm(`Are you sure you want to delete user: ${user.name}?`)) {
            const index = this.users.findIndex(u => u.username === user.username);
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
