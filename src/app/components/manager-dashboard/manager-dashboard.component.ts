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
    const allProjects = [
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
      },
      {
        projectId: 3,
        projectName: 'Project Gamma',
        status: 'In Progress',
        description: 'Database Migration',
        startDate: '2024-03-10',
        endDate: '2024-03-25', // Within 15 days
        priority: 'High',
        teamLead: 'Mike Johnson',
        teamSize: 3
      }
    ];

    // Filter recent projects (added in last 15 days)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    this.recentProjects = allProjects.filter(project => {
      const startDate = new Date(project.startDate);
      return startDate >= fifteenDaysAgo;
    });

    // Calculate upcoming deadlines (projects ending within 15 days)
    const today = new Date();
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(today.getDate() + 15);

    const upcomingDeadlines = allProjects.filter(project => {
      const endDate = new Date(project.endDate);
      return endDate >= today && endDate <= fifteenDaysFromNow;
    }).length;

    this.stats = {
      activeProjects: allProjects.filter(p => p.status === 'In Progress').length,
      totalTeamMembers: 12,
      pendingTasks: 15,
      completedTasks: 28,
      upcomingDeadlines: upcomingDeadlines
    };

    this.loading = false;
  }

  navigateToManagement() {
    this.router.navigate(['/planepage/select-project']);
  }

  navigateToCreateProject() {
    this.router.navigate(['/planepage/create-project'], {
      state: { fromDashboard: true }
    });
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
