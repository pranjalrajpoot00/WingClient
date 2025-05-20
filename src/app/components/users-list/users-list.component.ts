import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, User } from '../../services/data.service';

interface FilterOptions {
  department: string;
  manager: string;
  search: string;
}

@Component({
  selector: 'users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  departments = ['IDCC', 'IEC', 'ICC'];
  managers: string[] = [];
  
  filterOptions: FilterOptions = {
    department: '',
    manager: '',
    search: ''
  };

  sortOptions = {
    field: 'name',
    direction: 'asc'
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.managers = [...new Set(users
          .filter(user => user.role === 'manager')
          .map(user => user.name))];
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  getManagerName(managerId: number | undefined): string {
    if (!managerId) return 'None';
    const manager = this.users.find(user => user.id === managerId);
    return manager ? manager.name : 'Unknown';
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesDepartment = !this.filterOptions.department || user.department === this.filterOptions.department;
      const matchesManager = !this.filterOptions.manager || 
        (user.reportingMgr && this.getManagerName(user.reportingMgr) === this.filterOptions.manager);
      const matchesSearch = !this.filterOptions.search || 
        user.name.toLowerCase().includes(this.filterOptions.search.toLowerCase()) ||
        user.email.toLowerCase().includes(this.filterOptions.search.toLowerCase()) ||
        user.username.toLowerCase().includes(this.filterOptions.search.toLowerCase());

      return matchesDepartment && matchesManager && matchesSearch;
    });

    this.sortUsers();
  }

  sortUsers() {
    this.filteredUsers.sort((a, b) => {
      const aValue = a[this.sortOptions.field as keyof User];
      const bValue = b[this.sortOptions.field as keyof User];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortOptions.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }

  onSort(field: string) {
    if (this.sortOptions.field === field) {
      this.sortOptions.direction = this.sortOptions.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOptions.field = field;
      this.sortOptions.direction = 'asc';
    }
    this.sortUsers();
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }
}
