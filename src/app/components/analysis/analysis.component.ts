
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface TaskStats {
  notStarted: number;
  inProgress: number;
  inTesting: number;
  inReview: number;
  completed: number;
  overdue: number;
}

interface PieChartPaths {
  notStarted: string;
  inProgress: string;
  inTesting: string;
  inReview: string;
  completed: string;
  overdue: string;
}

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent implements OnInit {
  totalTasks: number = 30;
  taskStats: TaskStats = {
    notStarted: 4,
    inProgress: 10,
    inTesting: 5,
    inReview: 6,
    completed: 2,
    overdue: 3
  };
  pieChartPaths: PieChartPaths = {
    notStarted: '',
    inProgress: '',
    inTesting: '',
    inReview: '',
    completed: '',
    overdue: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.calculatePieChartPaths();
  }

  calculatePieChartPaths(): void {
    // Calculate angles for each segment based on task counts
    const total = this.totalTasks;
    const center = { x: 150, y: 150 };
    const radius = 150;

    // Starting angle (0 = top of circle)
    let startAngle = 0;
    
    // Calculate Not Started segment
    const notStartedAngle = (this.taskStats.notStarted / total) * 2 * Math.PI;
    this.pieChartPaths.notStarted = this.calculatePieSegment(center, radius, startAngle, startAngle + notStartedAngle);
    startAngle += notStartedAngle;
    
    // Calculate In Progress segment
    const inProgressAngle = (this.taskStats.inProgress / total) * 2 * Math.PI;
    this.pieChartPaths.inProgress = this.calculatePieSegment(center, radius, startAngle, startAngle + inProgressAngle);
    startAngle += inProgressAngle;
    
    // Calculate In Testing segment
    const inTestingAngle = (this.taskStats.inTesting / total) * 2 * Math.PI;
    this.pieChartPaths.inTesting = this.calculatePieSegment(center, radius, startAngle, startAngle + inTestingAngle);
    startAngle += inTestingAngle;
    
    // Calculate In Review segment
    const inReviewAngle = (this.taskStats.inReview / total) * 2 * Math.PI;
    this.pieChartPaths.inReview = this.calculatePieSegment(center, radius, startAngle, startAngle + inReviewAngle);
    startAngle += inReviewAngle;
    
    // Calculate Completed segment
    const completedAngle = (this.taskStats.completed / total) * 2 * Math.PI;
    this.pieChartPaths.completed = this.calculatePieSegment(center, radius, startAngle, startAngle + completedAngle);
    startAngle += completedAngle;
    
    // Calculate Overdue segment
    const overdueAngle = (this.taskStats.overdue / total) * 2 * Math.PI;
    this.pieChartPaths.overdue = this.calculatePieSegment(center, radius, startAngle, startAngle + overdueAngle);
  }

  calculatePieSegment(center: {x: number, y: number}, radius: number, startAngle: number, endAngle: number): string {
    // Calculate points on the arc
    const startX = center.x + radius * Math.sin(startAngle);
    const startY = center.y - radius * Math.cos(startAngle);
    const endX = center.x + radius * Math.sin(endAngle);
    const endY = center.y - radius * Math.cos(endAngle);
    
    // Determine if the segment is larger than a semicircle
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    // Create path
    return `M${center.x},${center.y} L${startX},${startY} A${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
  }

  logout(): void {
    // Implement logout logic here
    console.log('Logging out...');
    // Example navigation after logout:
    // this.router.navigate(['/login']);
  }
}