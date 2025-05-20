import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ActivityMonitoringComponent } from './components/activity-monitoring/activity-monitoring.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { SelectProjectComponent } from './components/select-project/select-project.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SelfHelpComponent } from './components/self-help/self-help.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProjectManagementComponent } from './components/project-management/project-management.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { PlanepageComponent } from './planepage/planepage.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { UserListComponent } from './components/users-list/users-list.component';
import { YourProjectsComponent } from './components/your-projects/your-projects.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { TeamleadDashboardComponent } from './components/teamlead-dashboard/teamlead-dashboard.component';
import { DeveloperDashboardComponent } from './components/developer-dashboard/developer-dashboard.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { TaskAnalysisComponent } from './components/task-analysis/task-analysis.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { TeamMembersComponent } from './components/team-members/team-members.component';
import { ResourceUtilizationComponent } from './components/resource-utilization/resource-utilization.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'planepage',
    component: PlanepageComponent,
    children: [
      { 
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        children: [
          { path: 'manage-users', component: ManageUsersComponent },
          { path: 'add-users', component: AddUserComponent },
          { path: 'activity-monitoring', component: ActivityMonitoringComponent },
          { path: '', redirectTo: 'manage-users', pathMatch: 'full' }
        ]
      },
      { 
        path: 'manager-dashboard',
        component: ManagerDashboardComponent
      },
      { 
        path: 'teamlead-dashboard',
        component: TeamleadDashboardComponent
      },
      { 
        path: 'developer-dashboard',
        component: DeveloperDashboardComponent
      },
      { path: 'calendar', component: CalendarComponent },
      { path: 'self-help', component: SelfHelpComponent },
      { path: 'users-list', component: UserListComponent },
      { path: 'project-list', component: ProjectListComponent },
      { path: 'select-project', component: SelectProjectComponent },
      { path: 'create-project', component: CreateProjectComponent },
      { path: 'project-management', component: ProjectManagementComponent },
      { path: 'resource-utilization', component: ResourceUtilizationComponent },
      { path: 'your-project-list', component: YourProjectsComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'task-management', component: TaskManagementComponent },
      { path: 'task-analysis', component: TaskAnalysisComponent },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'team-members', component: TeamMembersComponent },
      { path: '', redirectTo: 'manager-dashboard', pathMatch: 'full' }
    ]
  }
];
