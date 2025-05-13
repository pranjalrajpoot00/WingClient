import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ActivityMonitoringComponent } from './components/activity-monitoring/activity-monitoring.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
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
import { UserListComponent } from './components/users-list/users-list.component';
import { YourProjectsComponent } from './components/your-projects/your-projects.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RoleGuard } from './guards/role.guard';
import { TeamleadDashboardComponent } from './components/teamlead-dashboard/teamlead-dashboard.component';
import { DeveloperDashboardComponent } from './components/developer-dashboard/developer-dashboard.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { TaskAnalysisComponent } from './components/task-analysis/task-analysis.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { TeamMembersComponent } from './components/team-members/team-members.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'planepage',
    component: PlanepageComponent,
    children: [
      { 
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [RoleGuard],
        data: { role: 'admin' },
        children: [
          { path: '', redirectTo: 'manage-users', pathMatch: 'full' },
          { path: 'manage-users', component: ManageUsersComponent },
          { path: 'add-users', component: AddUserComponent },
          { path: 'activity-monitoring', component: ActivityMonitoringComponent }
        ]
      },
      { 
        path: 'manager-dashboard',
        component: ManagerDashboardComponent,
        canActivate: [RoleGuard],
        data: { role: 'manager' }
      },
      { 
        path: 'team-members',
        component: TeamMembersComponent,
        canActivate: [RoleGuard],
        data: { role: 'manager' }
      },
      { 
        path: 'teamlead-dashboard',
        component: TeamleadDashboardComponent,
        canActivate: [RoleGuard],
        data: { role: 'teamlead' }
      },
      { 
        path: 'developer-dashboard',
        component: DeveloperDashboardComponent,
        canActivate: [RoleGuard],
        data: { role: 'developer' }
      },
      { path: 'calendar', component: CalendarComponent },
      { path: 'self-help', component: SelfHelpComponent },
      { path: 'users-list', component: UserListComponent },
      { path: 'project-list', component: ProjectListComponent },
  { path: 'select-project', component: SelectProjectComponent },
  { path: 'project-details', component: ProjectDetailsComponent },
  { path: 'create-project', component: CreateProjectComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'your-project-list', component: YourProjectsComponent },
  { path: 'analysis', component: AnalysisComponent },
  {
        path: 'task-management',
        component: TaskManagementComponent,
        canActivate: [RoleGuard],
        data: { roles: ['teamlead', 'developer'] }
      },
      { 
        path: 'task-analysis',
        component: TaskAnalysisComponent,
        canActivate: [RoleGuard],
        data: { role: 'developer' }
      },
      { 
        path: 'my-profile',
        component: MyProfileComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'manager', 'teamlead', 'developer'] }
      },
      { path: '', redirectTo: 'manager-dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
