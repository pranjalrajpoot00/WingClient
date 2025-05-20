import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ProjectStatus, Project } from '../../types/project.types';

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

interface Task {
  taskId: number;
  projectID: number;
  assignedTo: number;
  description: string;
  deadline: string;
  status: string;
  priority: string;
  jiraLink: string | null;
  taskName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate: string | null;
  actualEndDate: string | null;
  estimatedHours: number;
  actualHours: number | null;
  assignee?: User;
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
  showStatusModal: boolean = false;
  currentProject: Project | null = null;
  tasks: Task[] = [];
  resources: Resource[] = [];
  selectedTask: Task | null = null;
  isEditing: boolean = false;
  selectedStatus: ProjectStatus = ProjectStatus.INITIATION;
  ProjectStatus = ProjectStatus;
  projectStatuses = Object.values(ProjectStatus);

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
  isJiraLocked: boolean = true;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const project = navigation.extras.state['project'];
      if (project) {
        this.currentProject = {
          ...project,
          status: project.status || ProjectStatus.INITIATION
        };
      }
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
    const project = projects.find((p: Project) => p.project_id === this.currentProject?.project_id);
    
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
    const storedTasks = localStorage.getItem(`tasks_${this.currentProject?.project_id}`);
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  loadResources() {
    const storedResources = localStorage.getItem(`resources_${this.currentProject?.project_id}`);
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
      const isReportingToManager = user.user_id === this.currentProject?.team?.team_lead_id;
      const isNotInProject = !this.resources.some(resource => resource.eid === user.user_id);
      return isReportingToManager && isNotInProject;
    });
  }

  openTaskModal(task?: Task) {
    if (task) {
      this.selectedTask = { ...task };
      this.isEditing = true;
      this.isJiraLocked = !task.jiraLink;
    } else {
      this.selectedTask = {
        taskId: this.tasks.length + 1,
        projectID: parseInt(this.currentProject?.project_id || '0'),
        assignedTo: 0,
        description: '',
        deadline: '',
        status: 'Not Started',
        priority: 'Medium',
        jiraLink: null,
        taskName: '',
        plannedStartDate: '',
        plannedEndDate: '',
        actualStartDate: null,
        actualEndDate: null,
        estimatedHours: 0,
        actualHours: null
      };
      this.isEditing = false;
      this.isJiraLocked = true;
    }
    this.showTaskModal = true;
  }

  openResourceModal() {
    this.loadAvailableUsers(); // Refresh available users list
    this.showResourceModal = true;
  }

  openStatusModal() {
    if (this.currentProject) {
      this.selectedStatus = this.currentProject.status as ProjectStatus;
      this.showStatusModal = true;
    }
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.selectedTask = null;
    this.isEditing = false;
  }

  closeResourceModal() {
    this.showResourceModal = false;
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.selectedStatus = ProjectStatus.INITIATION;
  }

  saveTask() {
    if (this.selectedTask) {
      // Get assignee details
      const assignee = this.availableAssignees.find(u => u.user_id === this.selectedTask?.assignedTo.toString());
      
      if (assignee) {
        this.selectedTask.assignee = assignee;
      }

      // Handle Jira link
      if (this.isJiraLocked) {
        this.selectedTask.jiraLink = null;
      }

      if (this.isEditing) {
        const index = this.tasks.findIndex(t => t.taskId === this.selectedTask?.taskId);
        if (index !== -1) {
          this.tasks[index] = { ...this.selectedTask };
        }
      } else {
        this.tasks.push({ ...this.selectedTask });
      }
      
      localStorage.setItem(`tasks_${this.currentProject?.project_id}`, JSON.stringify(this.tasks));
      this.closeTaskModal();
    }
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.taskId !== taskId);
      localStorage.setItem(`tasks_${this.currentProject?.project_id}`, JSON.stringify(this.tasks));
    }
  }

  removeResource(resource: Resource) {
    if (confirm('Are you sure you want to remove this team member?')) {
      this.resources = this.resources.filter(r => r.eid !== resource.eid);
      localStorage.setItem(`resources_${this.currentProject?.project_id}`, JSON.stringify(this.resources));
    }
  }

  updateTaskStatus(task: Task, newStatus: string) {
    const index = this.tasks.findIndex(t => t.taskId === task.taskId);
    if (index !== -1) {
      this.tasks[index].status = newStatus;
      localStorage.setItem(`tasks_${this.currentProject?.project_id}`, JSON.stringify(this.tasks));
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
        const assignedTasks = this.tasks.filter(task => task.assignedTo.toString() === resource.eid);
        const assignedHours = assignedTasks.reduce((total, task) => 
          total + (task.estimatedHours || 0), 0);
        
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
            taskName: task.taskName,
            estimatedHours: task.estimatedHours || 0,
            actualHours: task.actualHours || 0,
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
    localStorage.setItem(`resources_${this.currentProject?.project_id}`, JSON.stringify(this.resources));
    
    // Remove from available users
    this.availableAssignees = this.availableAssignees.filter(u => u.user_id !== user.user_id);
    
    // Close modal if no more available users
    if (this.availableAssignees.length === 0) {
      this.closeResourceModal();
    }
  }

  updateProjectStatus() {
    if (this.selectedStatus && this.currentProject) {
      // Update project status in localStorage
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const projectIndex = projects.findIndex((p: Project) => p.project_id === this.currentProject?.project_id);
      
      if (projectIndex !== -1) {
        projects[projectIndex].status = this.selectedStatus;
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Update current project
        if (this.currentProject) {
          this.currentProject.status = this.selectedStatus;
        }
      }
      
      this.closeStatusModal();
    }
  }

  getProjectStatusClass(status: ProjectStatus | undefined): string {
    if (!status) return '';
    
    switch (status) {
      case ProjectStatus.INITIATION:
        return 'status-initiation';
      case ProjectStatus.PLANNING:
        return 'status-planning';
      case ProjectStatus.EXECUTION:
        return 'status-execution';
      case ProjectStatus.MONITORING:
        return 'status-monitoring';
      case ProjectStatus.CLOSURE:
        return 'status-closure';
      default:
        return '';
    }
  }

  toggleJiraLock(): void {
    this.isJiraLocked = !this.isJiraLocked;
    if (this.selectedTask) {
      if (this.isJiraLocked) {
        this.selectedTask.jiraLink = null;
      }
    }
  }
} 