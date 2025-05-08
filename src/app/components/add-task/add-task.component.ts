import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Task {
  id: number;
  projectId: string;
  name: string;
  description: string;
  starts: string;
  due: string;
  role: string;
  assignee: string;
  hours: string;
  status: string;
  comments: Comment[];
  // For form binding
  startDate?: string;
  dueDate?: string;
}

interface Comment {
  author: string;
  date: string;
  text: string;
}

interface Resource {
  name: string;
  eid: string;
  role: string;
  hours: number;
  assignedTasks: Task[];
  isProjectMember?: boolean;
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit {
  // Task data
  tasks: Task[] = [];
  currentProject: any = null;
  
  // Resource data
  resources: Resource[] = [];
  projectResources: Resource[] = [];
  
  // UI state
  activeTab: string = 'Project Management';
  isAddTaskVisible: boolean = false;
  isCommentModalVisible: boolean = false;
  
  // New task form data
  newTask: Partial<Task> = {
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
    role: '',
    assignee: ''
  };
  
  // Comment modal data
  currentTaskId: number | null = null;
  currentTaskName: string = '';
  currentTaskComments: Comment[] = [];
  newComment: string = '';
  
  showAddMemberModal: boolean = false;
  availableResources: Resource[] = [];
  
  constructor(public router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.currentProject = navigation.extras.state['project'];
    }
    // TEMPORARY MOCK: If no project in navigation, use mock data
    if (!this.currentProject) {
      this.currentProject = {
        name: 'Demo Project',
        description: 'A test project',
        teamMembers: [
          { name: 'Tejas', role: 'PM' },
          { name: 'Kritika', role: 'Developer' }
        ]
      };
    }
  }
  
  ngOnInit(): void {
    this.loadInitialData();
  }
  
  loadInitialData(): void {
    // Load tasks from localStorage if available
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      // Filter tasks for current project
      if (this.currentProject) {
        this.tasks = allTasks.filter((task: Task) => task.projectId === this.currentProject.name);
        // Update resource assignments
        this.updateResourceAssignments();
      }
    } else {
      this.tasks = [];
    }

    // Load all resources
    this.resources = [
      {
        name: 'Sagar',
        eid: 'E40096601',
        role: 'PM',
        hours: 80,
        assignedTasks: []
      },
      {
        name: 'Tejas',
        eid: 'E40096602',
        role: 'Lead',
        hours: 100,
        assignedTasks: []
      },
      {
        name: 'Kritika',
        eid: 'E40096603',
        role: 'Developer',
        hours: 30,
        assignedTasks: []
      },
      {
        name: 'Tejaswini',
        eid: 'E40096604',
        role: 'Developer',
        hours: 40,
        assignedTasks: []
      },
      {
        name: 'Thayib',
        eid: 'E40096605',
        role: 'Developer',
        hours: 60,
        assignedTasks: []
      },
      {
        name: 'Pranjal',
        eid: 'E40096606',
        role: 'Developer',
        hours: 30,
        assignedTasks: []
      }
    ];

    // Ensure teamMembers exists
    if (!this.currentProject.teamMembers) {
      this.currentProject.teamMembers = [];
    }

    // Set available resources (those not in project)
    this.updateAvailableResources();

    // Filter resources to show only project members
    if (this.currentProject) {
      this.projectResources = this.resources.filter(resource => 
        this.currentProject.teamMembers.some((member: { name: string; role: string }) => member.name === resource.name)
      );
      // Mark resources as project members
      this.projectResources.forEach(resource => resource.isProjectMember = true);
    } else {
      this.projectResources = [];
    }
  }
  
  updateResourceAssignments(): void {
    // Reset all resource assignments
    this.projectResources.forEach(resource => {
      resource.assignedTasks = [];
    });
    
    // Assign tasks to resources
    this.tasks.forEach(task => {
      const resource = this.projectResources.find(r => r.name === task.assignee);
      if (resource) {
        resource.assignedTasks.push(task);
      }
    });
  }
  
  updateAvailableResources(): void {
    if (this.currentProject) {
      this.availableResources = this.resources.filter(resource => 
        // !this.currentProject.teamMembers.some(member => member.name === resource.name)
        !this.currentProject.teamMembers.some((member: { name: string; role: string }) => member.name === resource.name)
      );
    }
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  showAddTaskForm(): void {
    this.isAddTaskVisible = true;
    this.resetNewTask();
  }
  
  hideAddTaskForm(): void {
    this.isAddTaskVisible = false;
  }
  
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'overlay') {
      this.hideAddTaskForm();
    }
  }
  
  resetNewTask(): void {
    this.newTask = {
      name: '',
      description: '',
      startDate: '',
      dueDate: '',
      role: '',
      assignee: ''
    };
  }
  
  addNewTask(): void {
    if (!this.newTask.name || !this.newTask.startDate || !this.newTask.dueDate || !this.newTask.role || !this.newTask.assignee) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Format dates from YYYY-MM-DD to DD-MM-YY
    const startParts = this.newTask.startDate!.split('-');
    const dueParts = this.newTask.dueDate!.split('-');
    
    const startFormatted = `${startParts[2]}-${startParts[1]}-${startParts[0].substring(2)}`;
    const dueFormatted = `${dueParts[2]}-${dueParts[1]}-${dueParts[0].substring(2)}`;
    
    // Calculate hours based on date difference
    const start = new Date(this.newTask.startDate!);
    const end = new Date(this.newTask.dueDate!);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const hours = `${diffDays * 8} h`; // 8 hours per day
    
    // Create new task
    const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    
    const task: Task = {
      id: newId,
      projectId: this.currentProject.name,
      name: this.newTask.name,
      description: this.newTask.description || '',
      starts: startFormatted,
      due: dueFormatted,
      role: this.newTask.role,
      assignee: this.newTask.assignee,
      hours: hours,
      status: "In progress",
      comments: []
    };
    
    // Get all existing tasks
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Add new task to all tasks
    allTasks.push(task);
    
    // Save updated tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    
    // Update current tasks list
    this.tasks = allTasks.filter((t: Task) => t.projectId === this.currentProject.name);
    
    // Update resource assignments
    this.updateResourceAssignments();
    
    this.hideAddTaskForm();
  }
  
  editTask(taskId: number): void {
    // Implementation can be added if needed
    console.log("Edit task with ID:", taskId);
  }
  
  openCommentModal(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.currentTaskId = taskId;
      this.currentTaskName = task.name;
      this.currentTaskComments = [...task.comments];
      this.newComment = '';
      this.isCommentModalVisible = true;
    }
  }
  
  hideCommentModal(): void {
    this.isCommentModalVisible = false;
  }
  
  addComment(): void {
    if (!this.newComment.trim() || this.currentTaskId === null) {
      return;
    }
    
    // Get all tasks
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Find and update the task
    const taskIndex = allTasks.findIndex((t: Task) => t.id === this.currentTaskId);
    if (taskIndex !== -1) {
      // Get current date in DD-MM-YY format
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yy = String(today.getFullYear()).substring(2);
      const formattedDate = `${dd}-${mm}-${yy}`;
      
      // Add new comment
      const comment: Comment = {
        author: 'Sagar', // Current user
        date: formattedDate,
        text: this.newComment.trim()
      };
      
      allTasks[taskIndex].comments.push(comment);
      
      // Save updated tasks
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      
      // Update current tasks list
      this.tasks = allTasks.filter((t: Task) => t.projectId === this.currentProject.name);
      
      // Update modal
      this.currentTaskComments = [...allTasks[taskIndex].comments];
      this.newComment = '';
    }
  }

  showMemberManagement(): void {
    this.showAddMemberModal = true;
  }

  hideAddMemberModal(): void {
    this.showAddMemberModal = false;
  }

  addMemberToProject(resource: Resource): void {
    if (!this.currentProject) return;

    // Add to project members
    this.currentProject.teamMembers.push({
      name: resource.name,
      role: resource.role
    });

    // Update localStorage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex((p: any) => p.name === this.currentProject.name);
    if (projectIndex !== -1) {
      projects[projectIndex] = this.currentProject;
      localStorage.setItem('projects', JSON.stringify(projects));
    }

    // Update local arrays
    resource.isProjectMember = true;
    this.projectResources.push(resource);
    this.updateAvailableResources();
  }

  removeMemberFromProject(resource: Resource): void {
    if (!this.currentProject) return;

    // Check if member has any active tasks
    const hasActiveTasks = this.tasks.some(task => task.assignee === resource.name);
    if (hasActiveTasks) {
      alert('Cannot remove member with active tasks. Please reassign their tasks first.');
      return;
    }

    // Remove from project members
    this.currentProject.teamMembers = this.currentProject.teamMembers.filter(
      (member: { name: string; role: string }) => member.name !== resource.name
    );

    // Update localStorage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex((p: any) => p.name === this.currentProject.name);
    if (projectIndex !== -1) {
      projects[projectIndex] = this.currentProject;
      localStorage.setItem('projects', JSON.stringify(projects));
    }

    // Update local arrays
    resource.isProjectMember = false;
    this.projectResources = this.projectResources.filter(r => r.name !== resource.name);
    this.updateAvailableResources();
  }
}