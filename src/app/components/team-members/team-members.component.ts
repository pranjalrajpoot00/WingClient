import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

interface TeamMember {
  id: number;
  employeeName: string;
  username: string;
  skills: string[];
  role: string;
  reportingManager: number;
  projects: {
    projectId: number;
    projectName: string;
    role: string;
  }[];
}

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-members.component.html',
  styleUrl: './team-members.component.css'
})
export class TeamMembersComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  currentManagerId: number = 0;
  loading: boolean = true;
  showSkillModal: boolean = false;
  selectedMember: TeamMember | null = null;
  newSkill: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentManagerId = currentUser.id;
      this.loadTeamMembers();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadTeamMembers() {
    this.loading = true;
    // TODO: Replace with actual API call
    // Mock data for demonstration
    this.teamMembers = [
      {
        id: 1,
        employeeName: 'John Doe',
        username: 'johndoe',
        skills: ['Angular', 'Node.js', 'MongoDB'],
        role: 'developer',
        reportingManager: this.currentManagerId,
        projects: [
          { projectId: 1, projectName: 'Project Alpha', role: 'Developer' },
          { projectId: 2, projectName: 'Project Beta', role: 'Developer' }
        ]
      },
      {
        id: 2,
        employeeName: 'Jane Smith',
        username: 'janesmith',
        skills: ['React', 'Python', 'AWS'],
        role: 'developer',
        reportingManager: this.currentManagerId,
        projects: [
          { projectId: 1, projectName: 'Project Alpha', role: 'Developer' }
        ]
      },
      {
        id: 3,
        employeeName: 'Mike Johnson',
        username: 'mikejohnson',
        skills: ['Java', 'Spring Boot', 'SQL'],
        role: 'developer',
        reportingManager: this.currentManagerId,
        projects: [
          { projectId: 2, projectName: 'Project Beta', role: 'Developer' }
        ]
      }
    ];
    this.loading = false;
  }

  openSkillModal(member: TeamMember) {
    this.selectedMember = member;
    this.showSkillModal = true;
    this.newSkill = ''; // Reset new skill input
  }

  closeSkillModal() {
    this.showSkillModal = false;
    this.selectedMember = null;
    this.newSkill = ''; // Reset new skill input
  }

  removeSkill(member: TeamMember, skill: string) {
    // TODO: Replace with actual API call
    const memberIndex = this.teamMembers.findIndex(m => m.id === member.id);
    if (memberIndex !== -1) {
      this.teamMembers[memberIndex].skills = this.teamMembers[memberIndex].skills.filter(s => s !== skill);
    }
  }

  addSkill(member: TeamMember) {
    if (this.newSkill.trim()) {
      const skill = this.newSkill.trim();
      const memberIndex = this.teamMembers.findIndex(m => m.id === member.id);
      if (memberIndex !== -1 && !this.teamMembers[memberIndex].skills.includes(skill)) {
        this.teamMembers[memberIndex].skills.push(skill);
        this.newSkill = ''; // Reset input after adding
      }
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/planepage/manager-dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 