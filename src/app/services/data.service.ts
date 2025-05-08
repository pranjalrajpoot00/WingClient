import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  email: string;
  department: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'Not Started' | 'In Progress' | 'Completed';
  createdBy: string;
  teamMembers: string[];
  department: string;
  priority: 'Low' | 'Medium' | 'High';
  budget: number;
}

export interface Report {
  id: number;
  title: string;
  type: 'Project' | 'User' | 'Department';
  createdBy: string;
  createdAt: Date;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      name: 'Admin User',
      role: 'admin',
      email: 'admin@pratt.com',
      department: 'IT'
    },
    {
      id: 2,
      username: 'manager',
      name: 'Manager User',
      role: 'manager',
      email: 'manager@pratt.com',
      department: 'Engineering'
    },
    {
      id: 3,
      username: 'user',
      name: 'Regular User',
      role: 'user',
      email: 'user@pratt.com',
      department: 'Operations'
    }
  ];

  private projects: Project[] = [
    {
      id: 1,
      name: 'Engine Optimization',
      description: 'Optimize engine performance and efficiency',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      status: 'In Progress',
      createdBy: 'admin',
      teamMembers: ['manager', 'user'],
      department: 'Engineering',
      priority: 'High',
      budget: 1000000
    },
    {
      id: 2,
      name: 'Safety Protocol Update',
      description: 'Update safety protocols and documentation',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-30'),
      status: 'Not Started',
      createdBy: 'manager',
      teamMembers: ['user'],
      department: 'Operations',
      priority: 'Medium',
      budget: 500000
    }
  ];

  private reports: Report[] = [
    {
      id: 1,
      title: 'Q1 Project Status',
      type: 'Project',
      createdBy: 'admin',
      createdAt: new Date('2024-03-01'),
      data: {
        totalProjects: 10,
        completed: 3,
        inProgress: 5,
        notStarted: 2
      }
    },
    {
      id: 2,
      title: 'Department Performance',
      type: 'Department',
      createdBy: 'manager',
      createdAt: new Date('2024-03-15'),
      data: {
        departments: ['Engineering', 'Operations', 'IT'],
        performance: [85, 90, 88]
      }
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);
  private projectsSubject = new BehaviorSubject<Project[]>(this.projects);
  private reportsSubject = new BehaviorSubject<Report[]>(this.reports);

  constructor() { }

  // User CRUD operations
  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  addUser(user: Omit<User, 'id'>): void {
    const newUser: User = {
      ...user,
      id: this.getNextId(this.users)
    };
    this.users.push(newUser);
    this.usersSubject.next(this.users);
  }

  updateUser(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      this.usersSubject.next(this.users);
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
    this.usersSubject.next(this.users);
  }

  // Project CRUD operations
  getProjects(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }

  getProjectById(id: number): Project | undefined {
    return this.projects.find(project => project.id === id);
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
      id: this.getNextId(this.projects)
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
    this.projects = this.projects.filter(project => project.id !== id);
    this.projectsSubject.next(this.projects);
  }

  // Report CRUD operations
  getReports(): Observable<Report[]> {
    return this.reportsSubject.asObservable();
  }

  getReportById(id: number): Report | undefined {
    return this.reports.find(report => report.id === id);
  }

  addReport(report: Omit<Report, 'id'>): void {
    const newReport: Report = {
      ...report,
      id: this.getNextId(this.reports)
    };
    this.reports.push(newReport);
    this.reportsSubject.next(this.reports);
  }

  updateReport(report: Report): void {
    const index = this.reports.findIndex(r => r.id === report.id);
    if (index !== -1) {
      this.reports[index] = report;
      this.reportsSubject.next(this.reports);
    }
  }

  deleteReport(id: number): void {
    this.reports = this.reports.filter(report => report.id !== id);
    this.reportsSubject.next(this.reports);
  }

  // Helper method to get next ID
  private getNextId(items: any[]): number {
    return Math.max(...items.map(item => item.id), 0) + 1;
  }
} 