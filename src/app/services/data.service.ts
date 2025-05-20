import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;  // Primary key/identity
  username: string;  // Employee ID (E400xxx format)
  name: string;
  password?: string;
  skillSet?: string;
  reportingMgr?: number;  // References id of the manager
  role: string;
  email: string;
  phoneNumber?: string;
  department: string;
}

export interface Project {
  projectId: number;
  projectName: string;
  manager: number;
  status: string;
  description: string;
  jiraLink: string | null;
  startDate: Date;
  endDate: Date;
  priority: string;
  createDate: Date;
  department: string;
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
      username: 'E400001',
      name: 'Admin User',
      role: 'admin',
      email: 'admin@pratt.com',
      department: 'IDCC',
      reportingMgr: undefined,
      skillSet: 'Administration',
      phoneNumber: '123-456-7890'
    },
    {
      id: 2,
      username: 'E400002',
      name: 'Manager User',
      role: 'manager',
      email: 'manager@pratt.com',
      department: 'IEC',
      reportingMgr: 1,
      skillSet: 'Project Management',
      phoneNumber: '123-456-7891'
    },
    {
      id: 3,
      username: 'E400003',
      name: 'Regular User',
      role: 'user',
      email: 'user@pratt.com',
      department: 'ICC',
      reportingMgr: 2,
      skillSet: 'Development',
      phoneNumber: '123-456-7892'
    },
    {
      id: 4,
      username: 'E400004',
      name: 'Second Manager',
      role: 'manager',
      email: 'manager2@pratt.com',
      department: 'IDCC',
      reportingMgr: 1,
      skillSet: 'Team Leadership',
      phoneNumber: '123-456-7893'
    },
    {
      id: 5,
      username: 'E400005',
      name: 'Another User',
      role: 'user',
      email: 'user2@pratt.com',
      department: 'IEC',
      reportingMgr: 2,
      skillSet: 'Testing',
      phoneNumber: '123-456-7894'
    }
  ];

  private projects: Project[] = [
    {
      projectId: 1,
      projectName: 'Engine Optimization',
      manager: 2,
      status: 'In Progress',
      description: 'Optimize engine performance and efficiency',
      jiraLink: 'https://jira.example.com/ENG-001',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      priority: 'High',
      createDate: new Date('2024-01-01'),
      department: 'IEC'
    },
    {
      projectId: 2,
      projectName: 'Safety Protocol Update',
      manager: 2,
      status: 'Not Started',
      description: 'Update safety protocols and documentation',
      jiraLink: 'https://jira.example.com/SAF-001',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-30'),
      priority: 'Medium',
      createDate: new Date('2024-02-01'),
      department: 'IDCC'
    },
    {
      projectId: 3,
      projectName: 'Quality Control System',
      manager: 3,
      status: 'Completed',
      description: 'Implement new quality control measures',
      jiraLink: 'https://jira.example.com/QC-001',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-15'),
      priority: 'High',
      createDate: new Date('2024-01-15'),
      department: 'ICC'
    },
    {
      projectId: 4,
      projectName: 'Data Analytics Platform',
      manager: 1,
      status: 'In Progress',
      description: 'Develop new data analytics platform',
      jiraLink: 'https://jira.example.com/DATA-001',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-08-31'),
      priority: 'High',
      createDate: new Date('2024-03-01'),
      department: 'IDCC'
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

  addUser(user: Omit<User, 'id' | 'username'>): void {
    const newUser: User = {
      ...user,
      id: this.getNextId(this.users) as number,
      username: this.getNextEmployeeId()
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
    return this.projects.find(project => project.projectId === id);
  }

  getProjectsByUser(username: string): Observable<Project[]> {
    return new Observable(observer => {
      this.projectsSubject.subscribe(projects => {
        // First get the user's ID from their username
        const user = this.users.find(u => u.username === username);
        if (!user) {
          observer.next([]);
          return;
        }
        // Filter projects where the user is the manager
        const userProjects = projects.filter(project => project.manager === user.id);
        observer.next(userProjects);
      });
    });
  }

  addProject(project: Omit<Project, 'projectId'>): void {
    const newProject: Project = {
      ...project,
      projectId: this.getNextId(this.projects) as number
    };
    this.projects.push(newProject);
    this.projectsSubject.next(this.projects);
  }

  updateProject(project: Project): void {
    const index = this.projects.findIndex(p => p.projectId === project.projectId);
    if (index !== -1) {
      this.projects[index] = project;
      this.projectsSubject.next(this.projects);
    }
  }

  deleteProject(id: number): void {
    this.projects = this.projects.filter(project => project.projectId !== id);
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
      id: this.getNextId(this.reports) as number
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
  private getNextId(items: any[]): number | string {
    if (items.length === 0) return 1;

    // For User items
    if ('id' in items[0] && typeof items[0].id === 'number') {
      return Math.max(...items.map(item => item.id), 0) + 1;
    }

    // For Project and Report items
    return Math.max(...items.map(item => item.projectId || item.id), 0) + 1;
  }

  // Helper method to get next Employee ID
  private getNextEmployeeId(): string {
    const maxId = Math.max(...this.users.map(user => {
      const numPart = parseInt(user.username.substring(1));
      return isNaN(numPart) ? 0 : numPart;
    }));
    return `E${(maxId + 1).toString().padStart(6, '0')}`;
  }
} 