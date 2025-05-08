import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Project {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
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
  styleUrls: ['./select-project.component.css']
})
export class SelectProjectComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  showModal: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      this.projects = JSON.parse(savedProjects);
    }
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProject = null;
  }

  navigateToAddTask(): void {
    if (this.selectedProject) {
      this.router.navigate(['/add-task'], {
        state: { 
          project: {
            name: this.selectedProject.name,
            description: this.selectedProject.description,
            startDate: this.selectedProject.startDate,
            endDate: this.selectedProject.endDate,
            status: this.selectedProject.status,
            teamMembers: this.selectedProject.teamMembers
          }
        }
      });
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    // Implement actual logout logic here
    this.router.navigate(['/login']);
  }

  navigateToCreateProject(): void {
    this.router.navigate(['/create-project']);
  }
}