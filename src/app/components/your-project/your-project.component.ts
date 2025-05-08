import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService, Project } from '../../services/project.service';

@Component({
  selector: 'app-your-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './your-project.component.html',
  styleUrls: ['./your-project.component.css']
})
export class YourProjectComponent implements OnInit {
  projects: Project[] = [];
  currentUser: string = '';

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser).username;
      // Get projects for current user
      this.projectService.getProjectsByUser(this.currentUser).subscribe(projects => {
        this.projects = projects;
      });
    }
  }

  navigateToCreateProject() {
    this.router.navigate(['/project-form']);
  }

  deleteProject(project: Project) {
    if (confirm(`Are you sure you want to delete project: ${project.name}?`)) {
      this.projectService.deleteProject(project.id);
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
} 