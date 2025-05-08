import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, Project } from '../../services/data.service';

interface FilterOptions {
  status: string;
  priority: string;
  department: string;
  search: string;
}

@Component({
  selector: 'project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  currentUser: string = '';
  departments = ['Engineering', 'Operations', 'IT', 'HR', 'Finance'];
  priorities = ['Low', 'Medium', 'High'];
  statuses = ['Not Started', 'In Progress', 'Completed'];
  
  filterOptions: FilterOptions = {
    status: '',
    priority: '',
    department: '',
    search: ''
  };

  sortOptions = {
    field: 'name',
    direction: 'asc'
  };

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser).username;
      // Get projects for current user
      this.dataService.getProjectsByUser(this.currentUser).subscribe(projects => {
        this.projects = projects;
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesStatus = !this.filterOptions.status || project.status === this.filterOptions.status;
      const matchesPriority = !this.filterOptions.priority || project.priority === this.filterOptions.priority;
      const matchesDepartment = !this.filterOptions.department || project.department === this.filterOptions.department;
      const matchesSearch = !this.filterOptions.search || 
        project.name.toLowerCase().includes(this.filterOptions.search.toLowerCase()) ||
        project.description.toLowerCase().includes(this.filterOptions.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesDepartment && matchesSearch;
    });

    this.sortProjects();
  }

  sortProjects() {
    this.filteredProjects.sort((a, b) => {
      const aValue = a[this.sortOptions.field as keyof Project];
      const bValue = b[this.sortOptions.field as keyof Project];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortOptions.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortOptions.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return this.sortOptions.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
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
    this.sortProjects();
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  navigateToCreateProject() {
    this.router.navigate(['/project-form']);
  }

  editProject(project: Project) {
    this.router.navigate(['/project-form', project.id]);
  }

  deleteProject(project: Project) {
    if (confirm(`Are you sure you want to delete project: ${project.name}?`)) {
      this.dataService.deleteProject(project.id);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Not Started':
        return 'status-not-started';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'priority-low';
      case 'Medium':
        return 'priority-medium';
      case 'High':
        return 'priority-high';
      default:
        return '';
    }
  }
} 