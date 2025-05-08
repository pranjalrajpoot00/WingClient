import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavigationCard {
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-self-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './self-help.component.html',
  styleUrls: ['./self-help.component.css']
})
export class SelfHelpComponent implements OnInit {
  
  navigationCards: NavigationCard[] = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of our project management system and how to set up your workspace.'
    },
    {
      title: 'User Management',
      description: 'Instructions for adding, removing, and managing user permissions within your projects.'
    },
    {
      title: 'Project Setup',
      description: 'Guidelines for creating and configuring new projects in the system.'
    },
    {
      title: 'Resource Allocation',
      description: 'Learn how to effectively allocate resources across different projects and tasks.'
    },
    {
      title: 'Reporting Tools',
      description: 'Instructions for generating and customizing various project reports.'
    },
    {
      title: 'Troubleshooting',
      description: 'Solutions for common technical issues and system errors.'
    }
  ];

  faqItems: FaqItem[] = [
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address, and you will receive a password reset link. Follow the instructions in the email to create a new password.',
      isOpen: false
    },
    {
      question: 'How can I invite team members to a project?',
      answer: 'Navigate to the Project Settings page, select "Team Members" from the sidebar, and click the "Invite User" button. Enter the email addresses of the people you want to invite and select their role in the project.',
      isOpen: false
    },
    {
      question: 'Can I export project data to Excel?',
      answer: 'Yes, you can export project data to Excel. Go to the Reports section, select the data you want to export, and click the "Export to Excel" button in the top-right corner of the screen.',
      isOpen: false
    },
    {
      question: 'How do I track project milestones?',
      answer: 'Milestones can be created in the Project Timeline view. Click on "Add Milestone" and enter the milestone name, date, and description. You can then track progress and receive notifications as milestone dates approach.',
      isOpen: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  toggleFaq(faq: FaqItem): void {
    faq.isOpen = !faq.isOpen;
  }
}