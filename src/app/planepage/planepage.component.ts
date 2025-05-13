import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
// import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'planepage',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    // AdminDashboardComponent
  ],
  templateUrl: './planepage.component.html',
  styleUrls: ['./planepage.component.css']
})
export class PlanepageComponent {}
