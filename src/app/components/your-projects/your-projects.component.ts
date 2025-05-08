import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Project {
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  showOptions: boolean;
}

@Component({
  selector: 'your-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './your-projects.component.html',
  styleUrls: ['./your-projects.component.css']
})
export class YourProjectsComponent {
  projects: Project[] = [
    {
      name: 'I 4.0 TPM',
      startDate: '03-02-25',
      endDate: '31-05-25',
      status: 'In Progress',
      showOptions: false
    },
    {
      name: 'I 4.0 OACIS',
      startDate: '01-10-24',
      endDate: '20-06-25',
      status: 'In Progress',
      showOptions: false
    },
    {
      name: 'MRO Collab',
      startDate: '03-02-25',
      endDate: '31-07-25',
      status: 'In Progress',
      showOptions: false
    },
    {
      name: 'MRO WST',
      startDate: '01-05-25',
      endDate: '30-10-25',
      status: 'Yet to start',
      showOptions: false
    },
    {
      name: 'I 4.0 HMI',
      startDate: '03-02-25',
      endDate: '31-03-25',
      status: 'Completed',
      showOptions: false
    },
    {
      name: 'AMO licensing',
      startDate: '03-02-25',
      endDate: '02-04-25',
      status: 'Completed',
      showOptions: false
    }
  ];

  constructor(private router: Router) {}

  toggleStatus(project: Project): void {
    // Toggle dropdown state
    project.showOptions = !project.showOptions;
    
    // Get available options based on status
    let options: string[] = [];
    
    if (project.status === 'In Progress') {
      options = ['Mark as Complete', 'Put on Hold', 'Cancel Project'];
    } else if (project.status === 'Yet to start') {
      options = ['Start Project', 'Postpone', 'Cancel Project'];
    } else if (project.status === 'Completed') {
      options = ['Reopen', 'Archive'];
    }
    
    // In a real implementation, you would show these options in a dropdown
    // For now, we'll just alert them
    console.log(`Options for ${project.status}:\n- ${options.join('\n- ')}`);
    alert(`Options for ${project.status}:\n- ${options.join('\n- ')}`);
  }

  openProjectDetails(projectName: string): void {
    console.log(`Opening project details for: ${projectName}`);
    alert(`Opening details for project: ${projectName}`);
    
    // Navigate to project detail route (uncomment when routes are set up)
    // this.router.navigate(['/project', projectName]);
  }

  navigateTo(page: string): void {
    console.log(`Navigating to ${page}...`);
    alert(`Navigating to ${page} page...`);
    
    // Navigate to respective page (uncomment when routes are set up)
    // this.router.navigate(['/' + page.toLowerCase()]);
  }

  goToHome(event: Event): void {
    event.preventDefault();
    console.log('Navigating to Home page...');
    alert('Navigating to Home page...');
    
    // Navigate to home (uncomment when routes are set up)
    // this.router.navigate(['/home']);
  }

  logout(): void {
    console.log('Logging out...');
    alert('Logging out...');
    
    // Implement actual logout logic (uncomment when auth service is set up)
    // this.authService.logout().subscribe(() => {
    //   this.router.navigate(['/login']);
    // });
  }
}