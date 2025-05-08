import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Activity {
  user: string;
  role: string;
  action: string;
  time: string;
}

@Component({
  selector: 'app-activity-monitoring',
  templateUrl: './activity-monitoring.component.html',
  styleUrls: ['./activity-monitoring.component.css'],
  standalone: true,
  imports: [CommonModule] 
})


export class ActivityMonitoringComponent implements OnInit {
  activities: Activity[] = [
    { user: 'Sagar', role: 'PM', action: 'Logout', time: '2:00PM' },
    { user: 'Drishya', role: 'Lead', action: 'Login', time: '11:10AM' },
    { user: 'Tejas', role: 'Lead', action: 'Logout', time: '11:00AM' },
    { user: 'Sagar', role: 'PM', action: 'Login', time: '10:30AM' },
    { user: 'Tejas', role: 'Lead', action: 'Login', time: '10:00AM' },
    { user: 'Kritika', role: 'Developer', action: 'Login', time: '9:30AM' },
    { user: 'Ninaad', role: 'Developer', action: 'Login', time: '9:00AM' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // --- TEMPORARILY DISABLE login checking ---
    // const currentUser = localStorage.getItem('currentUser');
    // if (!currentUser) {
    //   this.router.navigate(['/login']);
    // }
  }

  switchTab(tab: string) {
    console.log(`${tab}`)
    this.router.navigate([`/${tab}`]);
}

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
  }
}
