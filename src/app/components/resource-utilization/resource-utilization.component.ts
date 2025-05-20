import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { BarVerticalComponent } from '@swimlane/ngx-charts';

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
  selector: 'app-resource-utilization',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './resource-utilization.component.html',
  styleUrl: './resource-utilization.component.css'
})
export class ResourceUtilizationComponent implements OnInit {
  currentProject: any = null;
  resourceData: ResourceUtilization[] = [];
  loading: boolean = true;
  error: string | null = null;

  // Chart options
  view: [number, number] = [700, 400];
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
    this.loadResourceUtilization();
  }

  public loadResourceUtilization() {
    this.loading = true;
    this.error = null;

    try {
      // Load tasks and resources from localStorage
      const tasks = JSON.parse(localStorage.getItem(`tasks_${this.currentProject.id}`) || '[]');
      const resources = JSON.parse(localStorage.getItem(`resources_${this.currentProject.id}`) || '[]');

      // Calculate utilization for each resource
      this.resourceData = resources.map((resource: any) => {
        const assignedTasks = tasks.filter((task: any) => task.assignee === resource.name);
        const assignedHours = assignedTasks.reduce((total: number, task: any) => 
          total + (parseInt(task.hours) || 0), 0);
        
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
          tasks: assignedTasks.map((task: any) => ({
            taskName: task.name,
            estimatedHours: parseInt(task.hours) || 0,
            actualHours: 0, // TODO: Implement actual hours tracking
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
    return this.resourceData.map(resource => ({
      name: resource.name,
      value: resource.utilizationPercentage
    }));
  }

  getOverUtilizedResources() {
    return this.resourceData.filter(resource => resource.utilizationPercentage > 100);
  }

  getUnderUtilizedResources() {
    return this.resourceData.filter(resource => resource.utilizationPercentage < 50);
  }

  navigateBack() {
    this.router.navigate(['/planepage/project-management'], {
      state: { project: this.currentProject }
    });
  }
} 