import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectStatus, Project } from '../../types/project.types';

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
  ProjectStatus = ProjectStatus; // Make enum available in template

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
      && typeof project.project_id === 'string'
      && typeof project.project_name === 'string'
      && typeof project.description === 'string'
      && typeof project.start_date === 'string'
      && typeof project.end_date === 'string'
      && typeof project.status === 'string'
      && typeof project.priority === 'string'
      && typeof project.team_id === 'string';
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
        project_id: '1',
        project_name: 'Project Alpha',
        description: 'A cutting-edge software development project',
        start_date: '2024-01-01',
        end_date: '2024-06-30',
        status: ProjectStatus.INITIATION,
        priority: 'High',
        team_id: '1',
        team: {
          team_id: '1',
          team_name: 'Alpha Team',
          team_lead_id: '1',
          department: 'Engineering'
        }
      },
      {
        project_id: '2',
        project_name: 'Project Beta',
        description: 'Mobile application development',
        start_date: '2024-02-01',
        end_date: '2024-08-31',
        status: ProjectStatus.PLANNING,
        priority: 'Medium',
        team_id: '2',
        team: {
          team_id: '2',
          team_name: 'Beta Team',
          team_lead_id: '2',
          department: 'Engineering'
        }
      }
    ];

    // Also load projects from localStorage to ensure we have the latest data
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]') as Project[];
    if (storedProjects.length > 0) {
      // Merge stored projects with mock data, preferring stored data
      const storedProjectMap = new Map(storedProjects.map(p => [p.project_id, p]));
      this.projects = this.projects.map(project => 
        storedProjectMap.get(project.project_id) || project
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
        const index = this.projects.findIndex(p => p.project_id === updatedProject.project_id);
        if (index !== -1) {
          console.log('Updating project at index:', index);
          this.projects[index] = updatedProject;
          // Update localStorage
          const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
          const storedIndex = storedProjects.findIndex((p: Project) => p.project_id === updatedProject.project_id);
          if (storedIndex !== -1) {
            storedProjects[storedIndex] = updatedProject;
            localStorage.setItem('projects', JSON.stringify(storedProjects));
          }
          
          // Set the selected project and show modal
          this.selectedProject = updatedProject;
          this.showModal = true;
        } else {
          console.error('Project not found in list:', updatedProject.project_id);
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
      // Store the project data before closing modal
      const projectData = {
        project_id: this.selectedProject.project_id,
        project_name: this.selectedProject.project_name,
        description: this.selectedProject.description,
        start_date: this.selectedProject.start_date,
        end_date: this.selectedProject.end_date,
        status: this.selectedProject.status,
        priority: this.selectedProject.priority,
        team_id: this.selectedProject.team_id,
        team: this.selectedProject.team
      };

      // Close the modal first
      this.closeModal();
      
      // Use setTimeout to ensure modal is closed before navigation
      setTimeout(() => {
        this.router.navigate(['/planepage/create-project'], {
          state: { 
            mode: 'edit',
            project: projectData
          }
        });
      }, 100);
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

  getStatusClass(status: ProjectStatus | undefined): string {
    if (!status) return '';
    
    switch (status) {
      case ProjectStatus.INITIATION:
        return 'status-initiation';
      case ProjectStatus.PLANNING:
        return 'status-planning';
      case ProjectStatus.EXECUTION:
        return 'status-execution';
      case ProjectStatus.MONITORING:
        return 'status-monitoring';
      case ProjectStatus.CLOSURE:
        return 'status-closure';
      default:
        return '';
    }
  }
}