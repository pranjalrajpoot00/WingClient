import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface TeamMember {
  name: string;
  role: string;
}

interface Project {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  teamMembers: TeamMember[];
}

interface Resource {
  name: string;
  eid: string;
  role: string;
  hours: number;
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup;
  showModal: boolean = false;
  availableMembers: Resource[] = [];
  selectedMembers: TeamMember[] = [];
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAvailableMembers();
  }

  loadAvailableMembers(): void {
    // Load members from resources component
    this.availableMembers = [
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
  }

  addMember(memberName: string): void {
    if (!memberName) return;
    
    const member = this.availableMembers.find(m => m.name === memberName);
    if (member && !this.selectedMembers.some(m => m.name === member.name)) {
      this.selectedMembers.push({
        name: member.name,
        role: member.role
      });
    }
  }

  removeMember(index: number): void {
    this.selectedMembers.splice(index, 1);
  }

  onSubmit(): void {
    if (this.projectForm.valid && this.selectedMembers.length > 0) {
      // Create new project
      const newProject: Project = {
        name: this.projectForm.get('projectName')?.value,
        description: this.projectForm.get('description')?.value,
        startDate: this.projectForm.get('startDate')?.value,
        endDate: this.projectForm.get('endDate')?.value,
        status: 'In Progress',
        teamMembers: this.selectedMembers
      };

      // Get existing projects from localStorage
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      
      // Add new project
      existingProjects.push(newProject);
      
      // Save updated projects
      localStorage.setItem('projects', JSON.stringify(existingProjects));

      this.showModal = true;
    } else {
      // Show validation errors
      if (this.projectForm.invalid) {
        Object.keys(this.projectForm.controls).forEach(key => {
          const control = this.projectForm.get(key);
          if (control?.invalid) {
            control.markAsTouched();
          }
        });
      }
      if (this.selectedMembers.length === 0) {
        alert('Please add at least one team member');
      }
    }
  }

  closeModal(): void {
    this.showModal = false;
    // Navigate to select-project page after closing modal
    this.router.navigate(['/select-project']);
  }

  onWindowClick(event: any): void {
    const modal = document.querySelector('.modal');
    if (event.target === modal) {
      this.closeModal();
    }
  }
}