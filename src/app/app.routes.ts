import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ActivityMonitoringComponent } from './components/activity-monitoring/activity-monitoring.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { YourProjectsComponent } from './components/your-projects/your-projects.component';
import { SelectProjectComponent } from './components/select-project/select-project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SelfHelpComponent } from './components/self-help/self-help.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { PlanepageComponent } from './planepage/planepage.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'activity-monitoring', component: ActivityMonitoringComponent },
  { path: 'add-users', component: AddUserComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'your-projects', component: YourProjectsComponent },
  { path: 'select-project', component: SelectProjectComponent },
  { path: 'project-details', component: ProjectDetailsComponent },
  { path: 'create-project', component: CreateProjectComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'analysis', component: AnalysisComponent },
  {
    path: 'planepage',
    component: PlanepageComponent,
    children: [
      { path: '', redirectTo: 'self-help', pathMatch: 'full' }, // Default route
      { path: 'calendar', component: CalendarComponent },
      { path: 'self-help', component: SelfHelpComponent },
      { path: 'resource-list', component: ResourceListComponent },
      { path: 'project-list', component: ProjectListComponent },

      // add more routes here as needed
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
