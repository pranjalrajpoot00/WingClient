import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';

// Define a type for user form data (without ID)
type UserFormData = Omit<User, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);
  private editModeSubject = new BehaviorSubject<{ isEditing: boolean; index: number }>({ isEditing: false, index: -1 });

  constructor() {
    // Load users from localStorage on service initialization
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
      this.usersSubject.next(this.users);
    }
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUserByIndex(index: number): User | undefined {
    return this.users[index];
  }

  addUser(userData: UserFormData): void {
    const newUser: User = {
      ...userData,
      id: this.getNextId()
    };
    this.users.push(newUser);
    this.usersSubject.next(this.users);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  editUser(index: number, userData: UserFormData): void {
    if (index >= 0 && index < this.users.length) {
      const originalId = this.users[index].id;
      this.users[index] = { ...userData, id: originalId };
      this.usersSubject.next(this.users);
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  deleteUser(index: number): void {
    if (index >= 0 && index < this.users.length) {
      this.users.splice(index, 1);
      this.usersSubject.next(this.users);
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  getEditMode(): Observable<{ isEditing: boolean; index: number }> {
    return this.editModeSubject.asObservable();
  }

  setEditMode(isEditing: boolean, index: number): void {
    this.editModeSubject.next({ isEditing, index });
  }

  clearEditMode(): void {
    this.editModeSubject.next({ isEditing: false, index: -1 });
  }

  getCurrentEditMode(): { isEditing: boolean; index: number } {
    return this.editModeSubject.value;
  }

  private getNextId(): number {
    const maxId = Math.max(...this.users.map(user => user.id), 0);
    return maxId + 1;
  }
} 