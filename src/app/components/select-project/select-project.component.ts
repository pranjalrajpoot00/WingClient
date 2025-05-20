import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  projectManager: number; // ID of the project manager
  teamMembers: TeamMember[];
}

interface TeamMember {
  name: string;
  role: string;
}

@Component({
  selector: 'app-select-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-project.component.html',
  styleUrl: './select-project.component.css'
})
export class SelectProjectComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  showModal: boolean = false;
  navigateToAnalysis: boolean = false;
  currentManagerId: number = 0;
  isManager: boolean = false;
  isTeamLead: boolean = false;
  private navigationState: { 
    navigateToAnalysis?: boolean;
    navigateToTaskManagement?: boolean;
    reopenModal?: boolean;
    updatedProject?: Project;
  } | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Store navigation state for later use
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.navigationState = navigation.extras.state as { 
        navigateToAnalysis?: boolean;
        navigateToTaskManagement?: boolean;
        reopenModal?: boolean;
        updatedProject?: Project;
      };
      this.navigateToAnalysis = this.navigationState.navigateToAnalysis || false;
    }
  }

  private isValidProject(project: any): project is Project {
    return project 
      && typeof project.id === 'number'
      && typeof project.name === 'string'
      && typeof project.description === 'string'
      && typeof project.startDate === 'string'
      && typeof project.endDate === 'string'
      && typeof project.status === 'string'
      && typeof project.projectManager === 'number'
      && Array.isArray(project.teamMembers);
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentManagerId = currentUser.id;
      this.isManager = this.authService.isManager();
      this.isTeamLead = this.authService.isTeamLead();
      this.loadProjects().then(() => {
        // Handle navigation state after projects are loaded
        this.handleNavigationState();
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private async loadProjects() {
    // TODO: Replace with actual API call
    // Mock data for projects
    this.projects = [
      {
        id: 1,
        name: 'Project Alpha',
        description: 'A cutting-edge software development project',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        status: 'Active',
        projectManager: this.currentManagerId,
        teamMembers: [
          { name: 'John Doe', role: 'Team Lead' },
          { name: 'Jane Smith', role: 'Developer' }
        ]
      },
      {
        id: 2,
        name: 'Project Beta',
        description: 'Mobile application development',
        startDate: '2024-02-01',
        endDate: '2024-08-31',
        status: 'Planning',
        projectManager: this.currentManagerId,
        teamMembers: [
          { name: 'Mike Johnson', role: 'Team Lead' },
          { name: 'Sarah Wilson', role: 'Developer' }
        ]
      }
    ].filter(project => project.projectManager === this.currentManagerId);

    // Also load projects from localStorage to ensure we have the latest data
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]') as Project[];
    if (storedProjects.length > 0) {
      // Merge stored projects with mock data, preferring stored data
      const storedProjectMap = new Map(storedProjects.map(p => [p.id, p]));
      this.projects = this.projects.map(project => 
        storedProjectMap.get(project.id) || project
      );
    }
  }

  private handleNavigationState() {
    if (!this.navigationState) return;

    if (this.navigationState.reopenModal && this.navigationState.updatedProject) {
      const updatedProject = this.navigationState.updatedProject;
      if (this.isValidProject(updatedProject)) {
        console.log('Handling updated project:', updatedProject);
        
        // Update the project in the projects list
        const index = this.projects.findIndex(p => p.id === updatedProject.id);
        if (index !== -1) {
          console.log('Updating project at index:', index);
          this.projects[index] = updatedProject;
          // Update localStorage
          const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
          const storedIndex = storedProjects.findIndex((p: Project) => p.id === updatedProject.id);
          if (storedIndex !== -1) {
            storedProjects[storedIndex] = updatedProject;
            localStorage.setItem('projects', JSON.stringify(storedProjects));
          }
          
          // Set the selected project and show modal
          this.selectedProject = updatedProject;
          this.showModal = true;
        } else {
          console.error('Project not found in list:', updatedProject.id);
        }
      }
    }
  }

  selectProject(project: Project) {
    this.selectedProject = project;
    
    if (this.navigateToAnalysis) {
      // For both manager and team lead, navigate to analysis if that's the intent
      this.router.navigate(['/planepage/analysis'], {
        state: { project: project }
      });
    } else if (this.navigationState?.navigateToTaskManagement && this.isTeamLead) {
      // For team lead, navigate to task management if that's the intent
      this.router.navigate(['/planepage/task-management'], {
        state: { project: project }
      });
    } else if (this.isManager) {
      // For manager, show project details modal for project management
      this.showModal = true;
    }
  }

  navigateToAddTask() {
    if (this.selectedProject) {
      this.router.navigate(['/planepage/add-task'], {
        state: { project: this.selectedProject }
      });
    }
  }

  navigateToCreateProject() {
    this.router.navigate(['/planepage/create-project']);
  }

  navigateToEditProject() {
    if (this.selectedProject) {
      this.router.navigate(['/planepage/create-project'], {
        state: { 
          mode: 'edit',
          project: this.selectedProject 
        }
      });
    }
  }

  navigateToDashboard() {
    if (this.isTeamLead) {
      this.router.navigate(['/planepage/teamlead-dashboard']);
    } else {
      this.router.navigate(['/planepage/manager-dashboard']);
    }
  }

  navigateToProjectManagement() {
    if (this.selectedProject) {
      this.router.navigate(['/planepage/project-management'], {
        state: { project: this.selectedProject }
      });
    }
  }

  navigateToTaskManagement() {
    if (this.selectedProject) {
      this.router.navigate(['/planepage/project-management'], {
        state: { project: this.selectedProject }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedProject = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}