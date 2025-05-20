import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService, Project, User } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  showSuccessModal = false;
  availableUsers: User[] = [];
  departments = ['Engineering', 'Operations', 'IT', 'HR', 'Finance'];
  priorities = ['Low', 'Medium', 'High'];
  isEditing = false;
  projectId: number | null = null;
  currentManagerId: number = 0;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Not Started', Validators.required],
      priority: ['Medium', Validators.required],
      department: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      teamMembers: [[]]
    }, { validator: this.dateRangeValidator });
  }

  ngOnInit() {
    // Get current user from auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentManagerId = currentUser.id;
      this.projectForm.patchValue({ createdBy: currentUser.username });
    } else {
      this.router.navigate(['/login']);
      return;
    }

    // Get available users for team members
    this.dataService.getUsers().subscribe(users => {
      this.availableUsers = users;
    });

    // Check if we're in edit mode from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { mode: string; project: Project };
      if (state.mode === 'edit' && state.project) {
        this.isEditing = true;
        this.projectId = state.project.id;
          this.projectForm.patchValue({
          name: state.project.name,
          description: state.project.description,
          startDate: this.formatDate(new Date(state.project.startDate)),
          endDate: this.formatDate(new Date(state.project.endDate)),
          status: state.project.status,
          priority: state.project.priority || 'Medium',
          department: state.project.department || '',
          budget: state.project.budget || 0,
          teamMembers: state.project.teamMembers.map(member => member.name)
          });
        }
      }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const project: Omit<Project, 'id'> = {
        ...formValue,
        startDate: new Date(formValue.startDate).toISOString(),
        endDate: new Date(formValue.endDate).toISOString(),
        createdBy: this.projectForm.get('createdBy')?.value,
        projectManager: this.currentManagerId
      };

      if (this.isEditing && this.projectId) {
        this.dataService.updateProject({ ...project, id: this.projectId });
      } else {
        this.dataService.addProject(project);
      }

      this.showSuccessModal = true;
      setTimeout(() => {
        this.showSuccessModal = false;
        this.router.navigate(['/planepage/select-project']);
      }, 2000);
    } else {
      this.markFormGroupTouched(this.projectForm);
    }
  }

  closeModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/your-project']);
  }

  // Custom validators
  private dateRangeValidator(group: FormGroup) {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return { dateRange: true };
      }
    }
    return null;
  }

  // Helper methods
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Form validation helpers
  get name() { return this.projectForm.get('name'); }
  get description() { return this.projectForm.get('description'); }
  get startDate() { return this.projectForm.get('startDate'); }
  get endDate() { return this.projectForm.get('endDate'); }
  get status() { return this.projectForm.get('status'); }
  get priority() { return this.projectForm.get('priority'); }
  get department() { return this.projectForm.get('department'); }
  get budget() { return this.projectForm.get('budget'); }
  get teamMembers() { return this.projectForm.get('teamMembers'); }
} 