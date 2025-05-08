import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

interface Resource {
  employeeId: number;
  employeeName: string;
  role: string;
  skillSet: string;
  reportingManager: string;
}

@Component({
  selector: 'resource-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSortModule
  ],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {
  allResources: Resource[] = [];
  filteredResources: Resource[] = [];
  displayedColumns = ['employeeId', 'employeeName', 'role', 'skillSet', 'reportingManager'];

  skillFilter = '';
  managerFilter = '';

  ngOnInit(): void {
    // Replace this mock data with real API call
    this.allResources = [
      { employeeId: 1, employeeName: 'Alice', role: 'Developer', skillSet: 'Angular', reportingManager: 'John' },
      { employeeId: 2, employeeName: 'Bob', role: 'Tester', skillSet: 'Selenium', reportingManager: 'Sara' },
      { employeeId: 3, employeeName: 'Charlie', role: 'Developer', skillSet: 'React', reportingManager: 'John' },
    ];
    this.filteredResources = this.allResources;
  }

  filterResources() {
    this.filteredResources = this.allResources.filter(resource =>
      (!this.skillFilter || resource.skillSet.toLowerCase().includes(this.skillFilter.toLowerCase())) &&
      (!this.managerFilter || resource.reportingManager.toLowerCase().includes(this.managerFilter.toLowerCase()))
    );
  }
}
