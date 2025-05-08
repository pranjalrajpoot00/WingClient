import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService, Project, User } from '../../services/data.service';

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

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
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
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const username = JSON.parse(currentUser).username;
      this.projectForm.patchValue({ createdBy: username });
    }

    // Get available users for team members
    this.dataService.getUsers().subscribe(users => {
      this.availableUsers = users;
    });

    // Check if we're editing an existing project
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.projectId = +params['id'];
        const project = this.dataService.getProjectById(this.projectId);
        if (project) {
          this.projectForm.patchValue({
            ...project,
            startDate: this.formatDate(project.startDate),
            endDate: this.formatDate(project.endDate)
          });
        }
      }
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const project: Omit<Project, 'id'> = {
        ...formValue,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        createdBy: this.projectForm.get('createdBy')?.value
      };

      if (this.isEditing && this.projectId) {
        this.dataService.updateProject({ ...project, id: this.projectId });
      } else {
        this.dataService.addProject(project);
      }

      this.showSuccessModal = true;
      setTimeout(() => {
        this.showSuccessModal = false;
        this.router.navigate(['/your-project']);
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