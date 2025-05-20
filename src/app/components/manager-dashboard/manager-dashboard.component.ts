import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

interface DashboardStats {
  activeProjects: number;
  totalTeamMembers: number;
  pendingTasks: number;
  completedTasks: number;
  upcomingDeadlines: number;
}

interface Project {
  projectId: number;
  projectName: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: string;
  teamLead: string;
  teamSize: number;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent implements OnInit {
  username: string = '';
  role: string = '';
  stats: DashboardStats = {
    activeProjects: 0,
    totalTeamMembers: 0,
    pendingTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0
  };
  recentProjects: Project[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username;
      this.role = currentUser.role;
      this.loadDashboardData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadDashboardData() {
    this.loading = true;
    // TODO: Replace with actual API calls
    // Mock data for demonstration
    this.stats = {
      activeProjects: 5,
      totalTeamMembers: 12,
      pendingTasks: 15,
      completedTasks: 28,
      upcomingDeadlines: 3
    };

    this.recentProjects = [
      {
        projectId: 1,
        projectName: 'Project Alpha',
        status: 'In Progress',
        description: 'Web Application Development',
        startDate: '2024-03-01',
        endDate: '2024-06-30',
        priority: 'High',
        teamLead: 'John Doe',
        teamSize: 5
      },
      {
        projectId: 2,
        projectName: 'Project Beta',
        status: 'Planning',
        description: 'Mobile App Development',
        startDate: '2024-04-01',
        endDate: '2024-08-31',
        priority: 'Medium',
        teamLead: 'Jane Smith',
        teamSize: 4
      }
    ];

    this.loading = false;
  }

  navigateToManagement() {
    this.router.navigate(['/planepage/select-project']);
  }

  navigateToCreateProject() {
    this.router.navigate(['/planepage/create-project']);
  }

  navigateToMyTeam() {
    this.router.navigate(['/planepage/team-members']);
  }

  navigateToAnalysis() {
    this.router.navigate(['/planepage/select-project'], {
      state: { navigateToAnalysis: true }
    });
  }

  navigateToProjectDetails(projectId: number) {
    this.router.navigate(['/planepage/project-details'], {
      state: { projectId: projectId }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/planepage/my-profile']);
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }

  getPriorityClass(priority: string): string {
    return 'priority-' + priority.toLowerCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
