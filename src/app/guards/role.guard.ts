import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

type UserRole = 'admin' | 'manager' | 'teamlead' | 'developer';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = (route.data['roles'] || [route.data['role']]) as UserRole[];
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.some((role: UserRole) => {
      switch (role) {
        case 'admin':
          return this.authService.isAdmin();
        case 'manager':
          return this.authService.isManager();
        case 'teamlead':
          return this.authService.isTeamLead();
        case 'developer':
          return this.authService.isDeveloper();
        default:
          return false;
      }
    });

    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's role
      if (this.authService.isAdmin()) {
        this.router.navigate(['/planepage/admin']);
      } else if (this.authService.isManager()) {
        this.router.navigate(['/planepage/manager-dashboard']);
      } else if (this.authService.isTeamLead()) {
        this.router.navigate(['/planepage/teamlead-dashboard']);
      } else if (this.authService.isDeveloper()) {
        this.router.navigate(['/planepage/developer-dashboard']);
      } else {
        this.router.navigate(['/planepage']);
      }
      return false;
    }

    return true;
  }
} 