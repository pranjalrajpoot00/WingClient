import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private editModeSubject = new BehaviorSubject<{isEditing: boolean, index: number}>({isEditing: false, index: -1});

  constructor() {
    // Load users from localStorage on service initialization
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  getUsers(): Observable<User[]> {
    return new Observable<User[]>(observer => {
      observer.next(this.users);
      observer.complete();
    });
  }

  addUser(user: User) {
    this.users.push(user);
    this.saveUsers();
  }

  editUser(index: number, updatedUser: User) {
    if (index >= 0 && index < this.users.length) {
      this.users[index] = updatedUser;
      this.saveUsers();
    }
  }

  deleteUser(index: number) {
    if (index >= 0 && index < this.users.length) {
      this.users.splice(index, 1);
      this.saveUsers();
    }
  }

  getUserByIndex(index: number): User | undefined {
    return this.users[index];
  }

  setEditMode(index: number) {
    this.editModeSubject.next({isEditing: true, index});
  }

  clearEditMode() {
    this.editModeSubject.next({isEditing: false, index: -1});
  }

  getEditMode(): Observable<{isEditing: boolean, index: number}> {
    return this.editModeSubject.asObservable();
  }

  getCurrentEditMode(): {isEditing: boolean, index: number} {
    return this.editModeSubject.value;
  }

  private saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }
} 