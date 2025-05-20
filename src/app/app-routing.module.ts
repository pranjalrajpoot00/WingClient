const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: MyProfileComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'manager', pathMatch: 'full' },
      { path: 'manager', component: ManagerDashboardComponent },
      { path: 'developer', component: DeveloperDashboardComponent },
      { path: 'teamlead', component: TeamleadDashboardComponent },
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'task-management', component: TaskManagementComponent },
      { path: 'project-status', component: ProjectStatusComponent },
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'analysis', component: AnalysisComponent }
    ]
  }
]; 