import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  description: string;
}

interface CalendarDay {
  date: number;
  events: CalendarEvent[];
  isOtherMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  calendar: CalendarDay[][] = [];

  // Mock events data
  private events: CalendarEvent[] = [
    {
      id: 1,
      title: 'I4.0 TPM Demo',
      date: new Date(2024, 3, 7),
      description: 'Industry 4.0 TPM Demonstration'
    },
    {
      id: 2,
      title: 'Sprint Review',
      date: new Date(2024, 3, 11),
      description: 'Weekly Sprint Review Meeting'
    },
    {
      id: 3,
      title: 'Project Planning',
      date: new Date(2024, 3, 15),
      description: 'Project Planning Session'
    },
    {
      id: 4,
      title: 'MRO Collab Meeting',
      date: new Date(2024, 3, 24),
      description: 'MRO Collaboration Meeting'
    },
    {
      id: 5,
      title: 'Team Sync',
      date: new Date(2024, 3, 25),
      description: 'Daily Team Sync'
    },
    {
      id: 6,
      title: 'Sprint Planning',
      date: new Date(2024, 3, 28),
      description: 'Sprint Planning Meeting'
    }
  ];

  constructor(
    private router: Router,
    // private authService: AuthService
  ) {}

  ngOnInit() {
    this.updateCalendar();
  }

  updateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.currentMonth = this.getMonthName(month);
    this.currentYear = year;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    this.calendar = [];
    let currentWeek: CalendarDay[] = [];
    
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      currentWeek.push({
        date: prevMonthLastDay - i,
        events: [],
        isOtherMonth: true
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dayEvents = this.events.filter(event => 
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      );
      
      currentWeek.push({
        date: day,
        events: dayEvents,
        isOtherMonth: false
      });
      
      if (currentWeek.length === 7) {
        this.calendar.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Add days from next month
    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: nextMonthDay,
        events: [],
        isOtherMonth: true
      });
      nextMonthDay++;
    }
    if (currentWeek.length > 0) {
      this.calendar.push(currentWeek);
    }
  }

  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  }

  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.updateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.updateCalendar();
  }

  isToday(day: CalendarDay): boolean {
    const today = new Date();
    return !day.isOtherMonth &&
           day.date === today.getDate() &&
           this.currentDate.getMonth() === today.getMonth() &&
           this.currentDate.getFullYear() === today.getFullYear();
  }

  showEventDetails(event: CalendarEvent) {
    console.log('Event details:', event);
    // TODO: Implement event details modal or page
  }

  goToHome() {
    this.router.navigate(['/admin/manage-users']);
  }

  logout() {
    // this.authService.logout();
  }
}
