import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  isActive: boolean;
  roles: string[];
  children?: NavigationItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      route: '/dashboard',
      isActive: true,
      roles: ['admin', 'manager', 'user']
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      route: '/projects',
      isActive: false,
      roles: ['admin', 'manager', 'user'],
      children: [
        {
          id: 'your-project',
          title: 'Your Projects',
          icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
          route: '/your-project',
          isActive: false,
          roles: ['admin', 'manager', 'user']
        },
        {
          id: 'project-form',
          title: 'Create Project',
          icon: 'M12 4v16m8-8H4',
          route: '/project-form',
          isActive: false,
          roles: ['admin', 'manager']
        }
      ]
    },
    {
      id: 'users',
      title: 'Users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      route: '/users',
      isActive: false,
      roles: ['admin'],
      children: [
        {
          id: 'manage-users',
          title: 'Manage Users',
          icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
          route: '/manage-users',
          isActive: false,
          roles: ['admin']
        },
        {
          id: 'add-user',
          title: 'Add User',
          icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
          route: '/add-user',
          isActive: false,
          roles: ['admin']
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      route: '/reports',
      isActive: false,
      roles: ['admin', 'manager']
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      route: '/settings',
      isActive: false,
      roles: ['admin']
    }
  ];

  private navigationSubject = new BehaviorSubject<NavigationItem[]>(this.navigationItems);
  private breadcrumbsSubject = new BehaviorSubject<NavigationItem[]>([]);

  constructor() { }

  getNavigationItems(): Observable<NavigationItem[]> {
    return this.navigationSubject.asObservable();
  }

  getBreadcrumbs(): Observable<NavigationItem[]> {
    return this.breadcrumbsSubject.asObservable();
  }

  setActiveItem(itemId: string): void {
    this.navigationItems = this.navigationItems.map(item => ({
      ...item,
      isActive: item.id === itemId,
      children: item.children?.map(child => ({
        ...child,
        isActive: child.id === itemId
      }))
    }));
    this.navigationSubject.next(this.navigationItems);
    this.updateBreadcrumbs(itemId);
  }

  getActiveItem(): NavigationItem | undefined {
    return this.navigationItems.find(item => item.isActive);
  }

  private updateBreadcrumbs(itemId: string): void {
    const breadcrumbs: NavigationItem[] = [];
    const findItem = (items: NavigationItem[], targetId: string): boolean => {
      for (const item of items) {
        if (item.id === targetId) {
          breadcrumbs.push(item);
          return true;
        }
        if (item.children) {
          if (findItem(item.children, targetId)) {
            breadcrumbs.unshift(item);
            return true;
          }
        }
      }
      return false;
    };

    findItem(this.navigationItems, itemId);
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  getNavigationItemsByRole(role: string): NavigationItem[] {
    return this.navigationItems.filter(item => 
      item.roles.includes(role) && 
      (!item.children || item.children.some(child => child.roles.includes(role)))
    );
  }
} 