import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'manager' | 'teamlead' | 'developer' | 'tester' | 'other';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Mock users for testing
  // Valid login credentials:
  // - Admin: username: 'admin', password: any, role: 'admin'
  // - Manager: username: 'manager', password: any, role: 'manager'
  // - Team Lead: username: 'teamlead', password: any, role: 'teamlead'
  // - Developer: username: 'developer', password: any, role: 'developer'
  // - Tester: username: 'tester', password: any, role: 'tester'
  private users: User[] = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'manager', role: 'manager' },
    { id: 3, username: 'teamlead', role: 'teamlead' },
    { id: 4, username: 'developer', role: 'developer' },
    { id: 5, username: 'tester', role: 'tester' }
  ];

  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string, role: string): boolean {
    // In a real application, this would be an API call
    const user = this.users.find(u => u.username === username && u.role === role);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isManager(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'manager';
  }

  isTeamLead(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'teamlead';
  }

  isDeveloper(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'developer';
  }

  isTester(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'tester';
  }
} 