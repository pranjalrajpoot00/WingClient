import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'Not Started' | 'In Progress' | 'Completed';
  createdBy: string;
  teamMembers: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  private projectsSubject = new BehaviorSubject<Project[]>(this.projects);
  private nextId = 1;

  constructor() { }

  getProjects(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }

  getProjectsByUser(username: string): Observable<Project[]> {
    return new Observable(observer => {
      this.projectsSubject.subscribe(projects => {
        const userProjects = projects.filter(project => 
          project.createdBy === username || project.teamMembers.includes(username)
        );
        observer.next(userProjects);
      });
    });
  }

  addProject(project: Omit<Project, 'id'>): void {
    const newProject: Project = {
      ...project,
      id: this.nextId++
    };
    this.projects.push(newProject);
    this.projectsSubject.next(this.projects);
  }

  updateProject(project: Project): void {
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      this.projects[index] = project;
      this.projectsSubject.next(this.projects);
    }
  }

  deleteProject(id: number): void {
    this.projects = this.projects.filter(p => p.id !== id);
    this.projectsSubject.next(this.projects);
  }
} 