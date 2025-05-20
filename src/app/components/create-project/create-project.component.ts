import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface TeamMember {
  name: string;
  role: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  projectManager: number;
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
  @ViewChild('projectFormElement') projectFormElement!: NgForm;
  projectForm: FormGroup;
  showModal: boolean = false;
  availableMembers: Resource[] = [];
  selectedMembers: TeamMember[] = [];
  isEditing: boolean = false;
  projectId: number | null = null;
  currentManagerId: number = 0;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    // Get navigation state from history
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { mode: string; project: Project };
      if (state.mode === 'edit' && state.project) {
        console.log('Edit mode detected with project:', state.project);
        this.isEditing = true;
        this.projectId = state.project.id;
        this.initializeFormWithProject(state.project);
      }
    }
  }

  ngOnInit(): void {
    // Get current user
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentManagerId = currentUser.id;
    } else {
      this.router.navigate(['/login']);
      return;
    }

    // Load available members
    this.loadAvailableMembers();

    // If we're in edit mode but form is not initialized (e.g., page refresh),
    // try to get project data from localStorage
    if (this.isEditing && this.projectId && !this.projectForm.get('projectName')?.value) {
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const project = existingProjects.find((p: Project) => p.id === this.projectId);
      if (project) {
        this.initializeFormWithProject(project);
      }
    }
  }

  private initializeFormWithProject(project: Project): void {
    this.projectForm.patchValue({
      projectName: project.name,
      description: project.description,
      startDate: this.formatDate(new Date(project.startDate)),
      endDate: this.formatDate(new Date(project.endDate))
    });
    this.selectedMembers = [...project.teamMembers];
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
    console.log('Form submitted', {
      isEditing: this.isEditing,
      formValid: this.projectForm.valid,
      formValue: this.projectForm.value,
      selectedMembers: this.selectedMembers
    });

    if (this.projectForm.valid && this.selectedMembers.length > 0) {
      try {
        const project: Project = {
          id: this.projectId || Date.now(),
        name: this.projectForm.get('projectName')?.value,
        description: this.projectForm.get('description')?.value,
        startDate: this.projectForm.get('startDate')?.value,
        endDate: this.projectForm.get('endDate')?.value,
        status: 'In Progress',
          projectManager: this.currentManagerId,
        teamMembers: this.selectedMembers
      };

        console.log('Saving project:', project);

      // Get existing projects from localStorage
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      
        if (this.isEditing && this.projectId) {
          console.log('Updating existing project');
          // Update existing project
          const index = existingProjects.findIndex((p: Project) => p.id === this.projectId);
          if (index !== -1) {
            existingProjects[index] = project;
      // Save updated projects
      localStorage.setItem('projects', JSON.stringify(existingProjects));

            console.log('Project updated, navigating back');
            // Navigate back to select project with updated data
            this.router.navigate(['/planepage/select-project'], {
              state: { 
                reopenModal: true,
                updatedProject: project
              }
            });
          } else {
            console.error('Project not found for update');
            alert('Error: Project not found for update');
          }
        } else {
          console.log('Creating new project');
          // Add new project
          existingProjects.push(project);
          // Save updated projects
          localStorage.setItem('projects', JSON.stringify(existingProjects));
      this.showModal = true;
        }
      } catch (error) {
        console.error('Error saving project:', error);
        alert('There was an error saving the project. Please try again.');
      }
    } else {
      console.log('Form validation failed', {
        formErrors: this.projectForm.errors,
        formStatus: this.projectForm.status,
        selectedMembersCount: this.selectedMembers.length
      });
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
    if (!this.isEditing) {
      this.router.navigate(['/planepage/select-project']);
    }
  }

  onWindowClick(event: any): void {
    const modal = document.querySelector('.modal');
    if (event.target === modal) {
      this.closeModal();
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}