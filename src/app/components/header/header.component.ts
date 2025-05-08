import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  pageTitle = 'Dashboard';
  userName = 'Sagar';
  userRole = 'PM';

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }
}
