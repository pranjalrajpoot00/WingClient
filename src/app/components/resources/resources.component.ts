
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Resource {
  name: string;
  eid: string;
  role: string;
  hours: number;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent {
  resources: Resource[] = [
    {
      name: 'Sagar',
      eid: 'E40096601',
      role: 'PM',
      hours: 80
    },
    {
      name: 'Tejas',
      eid: 'E40096602',
      role: 'Lead',
      hours: 100
    },
    {
      name: 'Kritika',
      eid: 'E40096603',
      role: 'Developer',
      hours: 30
    },
    {
      name: 'Tejaswini',
      eid: 'E40096604',
      role: 'Developer',
      hours: 40
    },
    {
      name: 'Thayib',
      eid: 'E40096605',
      role: 'Developer',
      hours: 60
    },
    {
      name: 'Pranjal',
      eid: 'E40096606',
      role: 'Developer',
      hours: 30
    }
  ];

  constructor() { }

  navigateToHome(): void {
    console.log('Navigate to home');
    // You can implement actual navigation using Router
    // this.router.navigate(['/home']);
  }
}