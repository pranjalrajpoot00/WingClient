import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

interface User {
  user_id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  department: string;
}

interface Team {
  team_id: string;
  team_name: string;
  team_lead_id: string;
  department: string;
}

interface TeamMember {
  team_member_id: string;
  team_id: string;
  user_id: string;
  allocation_percentage: number;
  join_date: string;
  leave_date: string | null;
  user?: User; // Joined user data
}

interface Project {
  project_id: string;
  project_name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  team_id: string;
  team?: Team; // Joined team data
}

interface Task {
  task_id: number;
  project_id: string;
  task_name: string;
  description: string;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  status: string;
  priority: string;
  estimated_hours: number;
  actual_hours: number | null;
  assignee_id: string;
  assignee?: User; // Joined user data
  comments: Comment[];
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

interface ResourceUtilization {
  name: string;
  eid: string;
  role: string;
  assignedHours: number;
  availableHours: number;
  utilizationPercentage: number;
  tasks: TaskUtilization[];
}

interface TaskUtilization {
  taskName: string;
  estimatedHours: number;
  actualHours: number;
  status: string;
}

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.css'
})
export class ProjectManagementComponent implements OnInit {
  activeTab: string = 'Project Management';
  showTaskModal: boolean = false;
  showResourceModal: boolean = false;
  showCommentModal: boolean = false;
  currentProject: any = null;
  tasks: Task[] = [];
  resources: Resource[] = [];
  newTask: Task = {
    task_id: 0,
    project_id: '',
    task_name: '',
    description: '',
    planned_start_date: '',
    planned_end_date: '',
    actual_start_date: null,
    actual_end_date: null,
    status: 'Not Started',
    priority: 'Medium',
    estimated_hours: 0,
    actual_hours: null,
    assignee_id: '',
    comments: []
  };
  newResource: Resource = {
    name: '',
    eid: '',
    role: '',
    hours: 0,
    assignedTasks: []
  };
  newComment: Comment = {
    author: '',
    date: '',
    text: ''
  };
  selectedTask: Task | null = null;
  isEditing: boolean = false;

  // Resource Utilization properties
  loading: boolean = false;
  error: string | null = null;
  resourceUtilizationData: ResourceUtilization[] = [];
  
  // Chart options
  chartView: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Resources';
  showYAxisLabel = true;
  yAxisLabel = 'Utilization (%)';
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  projectTeamMembers: TeamMember[] = [];
  availableAssignees: User[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.currentProject = navigation.extras.state['project'];
    }
  }

  ngOnInit() {
    if (!this.currentProject) {
      this.router.navigate(['/planepage/select-project']);
      return;
    }
    this.loadProjectData();
    this.loadTasks();
    this.loadResources();
    this.loadAvailableUsers();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'Resource Management') {
      this.loadResourceUtilization();
    }
  }

  loadProjectData() {
    // Load project with team information
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const project = projects.find((p: Project) => p.project_id === this.currentProject.id);
    
    if (project) {
      // Load team information
      const teams = JSON.parse(localStorage.getItem('teams') || '[]');
      const team = teams.find((t: Team) => t.team_id === project.team_id);
      
      if (team) {
        // Load team members
        const teamMembers = JSON.parse(localStorage.getItem('team_members') || '[]');
        this.projectTeamMembers = teamMembers.filter((tm: TeamMember) => 
          tm.team_id === team.team_id && !tm.leave_date
        );

        // Load user data for team members
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        this.projectTeamMembers = this.projectTeamMembers.map(member => ({
          ...member,
          user: users.find((u: User) => u.user_id === member.user_id)
        }));

        // Set available assignees (active team members)
        this.availableAssignees = this.projectTeamMembers
          .filter(member => member.user)
          .map(member => member.user!);
      }
    }
  }

  loadTasks() {
    const storedTasks = localStorage.getItem(`tasks_${this.currentProject.id}`);
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  loadResources() {
    const storedResources = localStorage.getItem(`resources_${this.currentProject.id}`);
    if (storedResources) {
      this.resources = JSON.parse(storedResources);
    }
  }

  loadAvailableUsers() {
    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Filter users who:
    // 1. Report to the current manager
    // 2. Are not already in the project team
    this.availableAssignees = allUsers.filter((user: User) => {
      const isReportingToManager = user.user_id === this.currentProject.team?.team_lead_id;
      const isNotInProject = !this.resources.some(resource => resource.eid === user.user_id);
      return isReportingToManager && isNotInProject;
    });
  }

  openTaskModal(task?: Task) {
    if (task) {
      this.selectedTask = { ...task };
      this.isEditing = true;
    } else {
      this.selectedTask = {
        task_id: this.tasks.length + 1,
        project_id: this.currentProject.id,
        task_name: '',
        description: '',
        planned_start_date: '',
        planned_end_date: '',
        actual_start_date: null,
        actual_end_date: null,
        status: 'Not Started',
        priority: 'Medium',
        estimated_hours: 0,
        actual_hours: null,
        assignee_id: '',
        comments: []
      };
      this.isEditing = false;
    }
    this.showTaskModal = true;
  }

  openResourceModal() {
    this.loadAvailableUsers(); // Refresh available users list
    this.showResourceModal = true;
  }

  openCommentModal(task: Task) {
    this.selectedTask = task;
    this.newComment = {
      author: 'Current User', // TODO: Get actual user name
      date: new Date().toISOString(),
      text: ''
    };
    this.showCommentModal = true;
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.selectedTask = null;
    this.isEditing = false;
  }

  closeResourceModal() {
    this.showResourceModal = false;
    this.newResource = {
      name: '',
      eid: '',
      role: '',
      hours: 0,
      assignedTasks: []
    };
  }

  closeCommentModal() {
    this.showCommentModal = false;
    this.newComment = {
      author: '',
      date: '',
      text: ''
    };
  }

  saveTask() {
    if (this.selectedTask) {
      // Get assignee details
      const assignee = this.availableAssignees.find(u => u.user_id === this.selectedTask?.assignee_id);
      
      if (assignee) {
        this.selectedTask.assignee = assignee;
      }

      if (this.isEditing) {
        const index = this.tasks.findIndex(t => t.task_id === this.selectedTask?.task_id);
        if (index !== -1) {
          this.tasks[index] = { ...this.selectedTask };
        }
      } else {
        this.tasks.push({ ...this.selectedTask });
      }
      
      localStorage.setItem(`tasks_${this.currentProject.id}`, JSON.stringify(this.tasks));
      this.closeTaskModal();
    }
  }

  saveResource() {
    if (this.newResource.name && this.newResource.eid && this.newResource.role) {
      this.resources.push({ ...this.newResource });
      localStorage.setItem(`resources_${this.currentProject.id}`, JSON.stringify(this.resources));
      this.closeResourceModal();
    }
  }

  saveComment() {
    if (this.selectedTask && this.newComment.text) {
      const taskIndex = this.tasks.findIndex(t => t.task_id === this.selectedTask?.task_id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].comments.push({ ...this.newComment });
        localStorage.setItem(`tasks_${this.currentProject.id}`, JSON.stringify(this.tasks));
        this.closeCommentModal();
      }
    }
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.task_id !== taskId);
      localStorage.setItem(`tasks_${this.currentProject.id}`, JSON.stringify(this.tasks));
    }
  }

  removeResource(resource: Resource) {
    if (confirm('Are you sure you want to remove this team member?')) {
      this.resources = this.resources.filter(r => r.eid !== resource.eid);
      localStorage.setItem(`resources_${this.currentProject.id}`, JSON.stringify(this.resources));
    }
  }

  updateTaskStatus(task: Task, newStatus: string) {
    const index = this.tasks.findIndex(t => t.task_id === task.task_id);
    if (index !== -1) {
      this.tasks[index].status = newStatus;
      localStorage.setItem(`tasks_${this.currentProject.id}`, JSON.stringify(this.tasks));
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'in progress':
        return 'status-in-progress';
      case 'not started':
        return 'status-not-started';
      default:
        return '';
    }
  }

  navigateBack() {
    this.router.navigate(['/planepage/select-project']);
  }

  navigateToResourceUtilization() {
    this.router.navigate(['/planepage/resource-utilization'], {
      state: { project: this.currentProject }
    });
  }

  loadResourceUtilization() {
    this.loading = true;
    this.error = null;

    try {
      // Calculate utilization for each resource
      this.resourceUtilizationData = this.resources.map(resource => {
        const assignedTasks = this.tasks.filter(task => task.assignee_id === resource.eid);
        const assignedHours = assignedTasks.reduce((total, task) => 
          total + (parseInt(task.estimated_hours.toString()) || 0), 0);
        
        // Assume 40 hours per week (8 hours/day * 5 days)
        const availableHours = 40;
        const utilizationPercentage = (assignedHours / availableHours) * 100;

        return {
          name: resource.name,
          eid: resource.eid,
          role: resource.role,
          assignedHours,
          availableHours,
          utilizationPercentage,
          tasks: assignedTasks.map(task => ({
            taskName: task.task_name,
            estimatedHours: parseInt(task.estimated_hours.toString()) || 0,
            actualHours: parseInt(task.actual_hours?.toString() || '0') || 0,
            status: task.status
          }))
        };
      });

      this.loading = false;
    } catch (err) {
      this.error = 'Failed to load resource utilization data';
      this.loading = false;
      console.error('Error loading resource utilization:', err);
    }
  }

  getChartData() {
    return this.resourceUtilizationData.map(resource => ({
      name: resource.name,
      value: resource.utilizationPercentage
    }));
  }

  getOverUtilizedResources() {
    return this.resourceUtilizationData.filter(resource => resource.utilizationPercentage > 100);
  }

  getUnderUtilizedResources() {
    return this.resourceUtilizationData.filter(resource => resource.utilizationPercentage < 50);
  }

  selectUser(user: User) {
    // Create a new resource from the selected user
    const newResource: Resource = {
      name: user.full_name,
      eid: user.user_id,
      role: user.role,
      hours: 40, // Default to 40 hours per week
      assignedTasks: []
    };

    // Add to resources
    this.resources.push(newResource);
    localStorage.setItem(`resources_${this.currentProject.id}`, JSON.stringify(this.resources));
    
    // Remove from available users
    this.availableAssignees = this.availableAssignees.filter(u => u.user_id !== user.user_id);
    
    // Close modal if no more available users
    if (this.availableAssignees.length === 0) {
      this.closeResourceModal();
    }
  }
} 