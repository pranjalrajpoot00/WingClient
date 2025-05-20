import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Task {
  task_id: number;
  description: string;
  status: string;
  assignment_date: string;
  deadline: string;
  assigned_to: string;
  created_by: string;
  repo_url_branch: string;
  project_name: string;
  days_remaining: number;
}

@Component({
  selector: 'app-task-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-analysis.component.html',
  styleUrl: './task-analysis.component.css'
})
export class TaskAnalysisComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  username: string = '';
  totalTasks: number = 0;
  completedTasks: number = 0;
  inProgressTasks: number = 0;
  overdueTasks: number = 0;
  selectedStatus: string = 'all';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username;
      this.loadTasks();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadTasks() {
    // TODO: Replace with actual API call
    // Mock data for demonstration
    this.tasks = [
      {
        task_id: 1,
        description: 'Implement user authentication',
        status: 'In Progress',
        assignment_date: '2024-03-15',
        deadline: '2024-03-20',
        assigned_to: this.username,
        created_by: 'Manager',
        repo_url_branch: 'feature/auth',
        project_name: 'Project Alpha',
        days_remaining: 2
      },
      {
        task_id: 2,
        description: 'Design database schema',
        status: 'Completed',
        assignment_date: '2024-03-10',
        deadline: '2024-03-15',
        assigned_to: this.username,
        created_by: 'Manager',
        repo_url_branch: 'feature/db-design',
        project_name: 'Project Alpha',
        days_remaining: -1
      },
      {
        task_id: 3,
        description: 'API Integration',
        status: 'Overdue',
        assignment_date: '2024-03-01',
        deadline: '2024-03-10',
        assigned_to: this.username,
        created_by: 'Team Lead',
        repo_url_branch: 'feature/api',
        project_name: 'Project Beta',
        days_remaining: -5
      }
    ];

    this.filteredTasks = [...this.tasks];
    this.calculateStatistics();
  }

  calculateStatistics() {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(task => task.status === 'Completed').length;
    this.inProgressTasks = this.tasks.filter(task => task.status === 'In Progress').length;
    this.overdueTasks = this.tasks.filter(task => task.status === 'Overdue').length;
  }

  filterTasks() {
    if (this.selectedStatus === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === this.selectedStatus);
    }
    this.sortByDeadline(); // Maintain sort order after filtering
  }

  sortByDeadline() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredTasks.sort((a, b) => {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }

  navigateToDashboard() {
    this.router.navigate(['/planepage/developer-dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 