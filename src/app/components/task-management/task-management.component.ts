import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css'
})
export class TaskManagementComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  showStatusModal: boolean = false;
  username: string = '';
  userRole: string = '';
  isDeveloper: boolean = false;

  statusOptions = [
    'Not Started',
    'In Progress',
    'In Testing',
    'In Review',
    'Completed',
    'Overdue'
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username;
      this.userRole = currentUser.role;
      this.isDeveloper = currentUser.role === 'developer';
      this.loadTasks();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadTasks() {
    // TODO: Replace with actual API call
    // Mock data for demonstration
    const mockTasks: Task[] = [
      {
        task_id: 1,
        description: 'Implement user authentication',
        status: 'In Progress',
        assignment_date: '2024-03-15',
        deadline: '2024-03-20',
        assigned_to: 'developer1',
        created_by: 'Manager',
        repo_url_branch: 'feature/auth',
        project_name: 'Project Alpha'
      },
      {
        task_id: 2,
        description: 'Design database schema',
        status: 'Completed',
        assignment_date: '2024-03-10',
        deadline: '2024-03-15',
        assigned_to: 'developer2',
        created_by: 'Team Lead',
        repo_url_branch: 'feature/db-design',
        project_name: 'Project Alpha'
      },
      {
        task_id: 3,
        description: 'API Integration',
        status: 'Overdue',
        assignment_date: '2024-03-01',
        deadline: '2024-03-10',
        assigned_to: 'developer1',
        created_by: 'Team Lead',
        repo_url_branch: 'feature/api',
        project_name: 'Project Beta'
      }
    ];

    // Filter tasks based on user role
    this.tasks = this.isDeveloper 
      ? mockTasks.filter(task => task.assigned_to === this.username)
      : mockTasks;
  }

  updateTaskStatus(task: Task, newStatus: string) {
    // TODO: Replace with actual API call
    const taskIndex = this.tasks.findIndex(t => t.task_id === task.task_id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].status = newStatus;
    }
    this.showStatusModal = false;
    this.selectedTask = null;
  }

  openStatusModal(task: Task) {
    this.selectedTask = task;
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.selectedTask = null;
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }

  navigateToDashboard() {
    if (this.isDeveloper) {
      this.router.navigate(['/planepage/developer-dashboard']);
    } else {
      this.router.navigate(['/planepage/teamlead-dashboard']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 