import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  hover = false;
  activeComponent: string | null = null;
  previousRoute: string = '';
  private routeSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize route subscription
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      // Only update previousRoute if we're not toggling a sidebar component
      if (!this.isSidebarComponent(url)) {
        this.previousRoute = url;
      }
    });
  }

  ngOnInit() {
    // Set initial previous route
    const currentUrl = this.router.url;
    if (!this.isSidebarComponent(currentUrl)) {
      this.previousRoute = currentUrl;
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private isSidebarComponent(url: string): boolean {
    const sidebarComponents = ['project-list', 'users-list', 'calendar', 'self-help'];
    return sidebarComponents.some(component => url.includes(component));
  }

  toggleComponent(component: string) {
    if (this.activeComponent === component) {
      // If clicking the same button, return to previous view
      this.activeComponent = null;
      if (this.previousRoute) {
        // Navigate back to the exact previous route
        this.router.navigate([this.previousRoute]);
      } else {
        // Fallback to role-based default route if no previous route
        if (this.authService.isAdmin()) {
          this.router.navigate(['/planepage/admin']);
        } else {
          this.router.navigate(['/planepage/manager-dashboard']);
        }
      }
    } else {
      // Store current route as previous before navigating to new component
      if (!this.isSidebarComponent(this.router.url)) {
        this.previousRoute = this.router.url;
      }
      // Navigate to the new component
      this.activeComponent = component;
      this.router.navigate(['/planepage', component]);
    }
  }

  isActive(component: string): boolean {
    return this.activeComponent === component;
  }
}
