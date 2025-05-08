import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateTo(page: string) {
    console.log(`Navigating to ${page} page...`);
    // In a real application, you would navigate to the appropriate page
    this.router.navigate([`/${page}`]);
  }

  logout() {
    console.log('Logging out...');
    // In a real application, you would handle the logout process
    this.router.navigate(['/login']);
  }
}
