import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  name: string;
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { name: 'Sagar', username: 'sagar', password: '****', role: 'PM' },
    { name: 'Drishya', username: 'drishya', password: '****', role: 'Lead' },
    { name: 'Tejas', username: 'tejas', password: '****', role: 'Lead' },
    { name: 'Muskan', username: 'muskan', password: '****', role: 'PM' },
    { name: 'Pranjal', username: 'pranjal', password: '****', role: 'Developer' },
    { name: 'Kritika', username: 'kritika', password: '****', role: 'Developer' },
    { name: 'Ninaad', username: 'ninaad', password: '****', role: 'Developer' }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);
  private editModeSubject = new BehaviorSubject<{isEditing: boolean, index: number}>({isEditing: false, index: -1});

  constructor() { }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getEditMode(): Observable<{isEditing: boolean, index: number}> {
    return this.editModeSubject.asObservable();
  }

  getUserByIndex(index: number): User | null {
    if (index >= 0 && index < this.users.length) {
      return { ...this.users[index] };
    }
    return null;
  }

  addUser(user: User): void {
    this.users.push(user);
    this.usersSubject.next(this.users);
  }

  setEditMode(index: number): void {
    this.editModeSubject.next({isEditing: true, index});
  }

  clearEditMode(): void {
    this.editModeSubject.next({isEditing: false, index: -1});
  }

  editUser(index: number, updatedUser: User): void {
    if (index >= 0 && index < this.users.length) {
      this.users[index] = updatedUser;
      this.usersSubject.next(this.users);
      this.clearEditMode();
    }
  }

  deleteUser(index: number): void {
    if (index >= 0 && index < this.users.length) {
      this.users.splice(index, 1);
      this.usersSubject.next(this.users);
    }
  }
} 