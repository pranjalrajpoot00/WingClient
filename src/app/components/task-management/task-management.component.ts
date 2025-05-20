import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Task {
  task_id: number;
  taskName: string;
  description: string;
  status: string;
  priority: string;
  jiraLink: string | null;
  plannedStartDate: string;
  plannedEndDate: string;
  deadline: string;
  assigned_to: string;
  assignedOn: string;
  project_name: string;
  estimatedHours: number;
  actualHours?: number;
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
    'In Progress',
    'In Testing',
    'In Review',
    'Completed'
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
        taskName: 'Implement Authentication',
        description: 'Implement user authentication system',
        status: 'In Progress',
        priority: 'High',
        jiraLink: 'https://jira.example.com/TASK-1',
        plannedStartDate: '2024-03-15',
        plannedEndDate: '2024-03-20',
        deadline: '2024-03-20',
        assigned_to: 'developer1',
        assignedOn: '2024-03-14',
        project_name: 'Project Alpha',
        estimatedHours: 40,
        actualHours: 25
      },
      {
        task_id: 2,
        taskName: 'Database Design',
        description: 'Design and implement database schema',
        status: 'Completed',
        priority: 'Medium',
        jiraLink: 'https://jira.example.com/TASK-2',
        plannedStartDate: '2024-03-10',
        plannedEndDate: '2024-03-15',
        deadline: '2024-03-15',
        assigned_to: 'developer2',
        assignedOn: '2024-03-09',
        project_name: 'Project Alpha',
        estimatedHours: 24,
        actualHours: 20
      },
      {
        task_id: 3,
        taskName: 'API Integration',
        description: 'Integrate third-party API services',
        status: 'Overdue',
        priority: 'High',
        jiraLink: null,
        plannedStartDate: '2024-03-01',
        plannedEndDate: '2024-03-10',
        deadline: '2024-03-10',
        assigned_to: 'developer1',
        assignedOn: '2024-02-28',
        project_name: 'Project Beta',
        estimatedHours: 32,
        actualHours: 35
      }
    ];

    // Filter tasks based on user role
    this.tasks = this.isDeveloper 
      ? mockTasks.filter(task => task.assigned_to === this.username)
      : mockTasks;

    // Update task statuses based on dates
    this.updateTaskStatuses();
  }

  updateTaskStatuses() {
    const currentDate = new Date();
    
    this.tasks.forEach(task => {
      const plannedStartDate = new Date(task.plannedStartDate);
      const plannedEndDate = new Date(task.plannedEndDate);

      // If current date is before planned start date, set status to "Not Started"
      if (currentDate < plannedStartDate) {
        task.status = 'Not Started';
      }
      // If current date is after planned end date and status is not "Completed", set to "Overdue"
      else if (currentDate > plannedEndDate && task.status !== 'Completed') {
        task.status = 'Overdue';
      }
    });
  }

  updateTaskStatus(task: Task, newStatus: string) {
    // Only allow status update if the task is not automatically set to "Not Started" or "Overdue"
    const currentDate = new Date();
    const plannedStartDate = new Date(task.plannedStartDate);
    const plannedEndDate = new Date(task.plannedEndDate);

    if (currentDate < plannedStartDate) {
      // Don't allow status update if before planned start date
      return;
    }

    if (currentDate > plannedEndDate && newStatus !== 'Completed') {
      // Don't allow status update if after planned end date and not setting to Completed
      return;
    }

    // TODO: Replace with actual API call
    const taskIndex = this.tasks.findIndex(t => t.task_id === task.task_id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].status = newStatus;
    }
    this.showStatusModal = false;
    this.selectedTask = null;
  }

  openStatusModal(task: Task) {
    // Don't open modal if task is automatically set to "Not Started" or "Overdue"
    const currentDate = new Date();
    const plannedStartDate = new Date(task.plannedStartDate);
    const plannedEndDate = new Date(task.plannedEndDate);

    if (currentDate < plannedStartDate || (currentDate > plannedEndDate && task.status !== 'Completed')) {
      return;
    }

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