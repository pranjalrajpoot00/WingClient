import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, User } from '../../services/data.service';

interface Project {
  projectId: number;
  projectName: string;
  manager: number;
  status: string;
  description: string;
  jiraLink: string | null;
  startDate: Date;
  endDate: Date;
  priority: string;
  createDate: Date;
  department: string;
  teamMembers: User[];
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
  availableMembers: User[] = [];
  selectedMembers: User[] = [];
  isEditing: boolean = false;
  projectId: number | null = null;
  currentUser: User | null = null;
  isJiraLocked: boolean = true;
  fromDashboard: boolean = false;
  
  readonly projectStatuses = [
    'Initiation',
    'Planning',
    'Execution',
    'Monitoring and Control',
    'Closure'
  ];

  readonly priorities = ['High', 'Medium', 'Low'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      priority: ['Medium', Validators.required],
      jiraLink: [{ value: '', disabled: true }, [Validators.maxLength(200)]]
    });

    // Get navigation state from history
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { mode: string; project: any; fromDashboard?: boolean };
      if (state.mode === 'edit' && state.project) {
        this.isEditing = true;
        this.projectId = state.project.project_id;
        this.initializeFormWithProject(state.project);
      }
      // Store if navigation came from dashboard
      this.fromDashboard = state.fromDashboard || false;
    }
  }

  ngOnInit(): void {
    // Get current user from auth service and then get full user details from data service
    const authUser = this.authService.getCurrentUser();
    if (!authUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Get full user details from data service
    this.dataService.getUsers().subscribe(users => {
      this.currentUser = users.find(u => u.id === authUser.id) || null;
      if (this.currentUser) {
        // Load available members (users who report to this manager)
        this.loadAvailableMembers();
      } else {
        this.router.navigate(['/login']);
        return;
      }
    });

    // If we're in edit mode but form is not initialized, try to get project data
    if (this.isEditing && this.projectId && !this.projectForm.get('projectName')?.value) {
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const project = existingProjects.find((p: any) => p.project_id === this.projectId);
      if (project) {
        this.initializeFormWithProject(project);
      }
    }
  }

  private initializeFormWithProject(project: any): void {
    this.projectForm.patchValue({
      projectName: project.project_name,
      description: project.description,
      startDate: this.formatDate(new Date(project.start_date)),
      endDate: this.formatDate(new Date(project.end_date)),
      priority: project.priority,
      jiraLink: project.jira_link
    });
    
    // Load team members if available
    if (project.team?.team_members) {
      this.selectedMembers = project.team.team_members;
    }
    
    this.isJiraLocked = !project.jira_link;
  }

  loadAvailableMembers(): void {
    // Load all users from data service
    this.dataService.getUsers().subscribe(users => {
      // Filter users who report to the current manager
      this.availableMembers = users.filter(user => 
        user.role === 'developer' && // Assuming developers report to managers
        user.department === this.currentUser?.department // Same department
      );
    });
  }

  toggleJiraLock(): void {
    this.isJiraLocked = !this.isJiraLocked;
    const jiraControl = this.projectForm.get('jiraLink');
    if (this.isJiraLocked) {
      jiraControl?.disable();
      jiraControl?.setValue('');
    } else {
      jiraControl?.enable();
    }
  }

  addMember(userId: number): void {
    if (!userId) return;
    
    const member = this.availableMembers.find(m => m.id === userId);
    if (member && !this.selectedMembers.some(m => m.id === member.id)) {
      this.selectedMembers.push(member);
    }
  }

  removeMember(userId: number): void {
    this.selectedMembers = this.selectedMembers.filter(m => m.id !== userId);
  }

  onSubmit(): void {
    if (this.projectForm.valid && this.selectedMembers.length > 0 && this.currentUser) {
      try {
        const project: Project = {
          projectId: this.projectId || Date.now(),
          projectName: this.projectForm.get('projectName')?.value,
          manager: this.currentUser.id,
          status: 'Initiation', // Default status
          description: this.projectForm.get('description')?.value,
          jiraLink: this.isJiraLocked ? null : this.projectForm.get('jiraLink')?.value,
          startDate: new Date(this.projectForm.get('startDate')?.value),
          endDate: new Date(this.projectForm.get('endDate')?.value),
          priority: this.projectForm.get('priority')?.value,
          createDate: new Date(),
          department: this.currentUser.department,
          teamMembers: this.selectedMembers
        };

        // Get existing projects from localStorage
        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        if (this.isEditing && this.projectId) {
          // Update existing project
          const index = existingProjects.findIndex((p: Project) => p.projectId === this.projectId);
          if (index !== -1) {
            existingProjects[index] = project;
            localStorage.setItem('projects', JSON.stringify(existingProjects));
            this.router.navigate(['/planepage/select-project'], {
              state: { 
                reopenModal: true,
                updatedProject: project
              }
            });
          }
        } else {
          // Add new project
          existingProjects.push(project);
          localStorage.setItem('projects', JSON.stringify(existingProjects));
          this.showModal = true;
        }
      } catch (error) {
        console.error('Error saving project:', error);
        alert('There was an error saving the project. Please try again.');
      }
    } else {
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

  cancel(): void {
    if (this.isEditing) {
      // If in edit mode, go back to select-project page
      this.router.navigate(['/planepage/select-project']);
    } else if (this.fromDashboard) {
      // If came from dashboard, go back to dashboard
      this.router.navigate(['/planepage/manager-dashboard']);
    } else {
      // Default case: go to select-project page
      this.router.navigate(['/planepage/select-project']);
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}