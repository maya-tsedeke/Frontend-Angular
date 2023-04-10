import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public users: any[] = [];
  public stations: any[] = [];

  loginId!: number;
  journeys: any[] = [];
  currentDate: Date = new Date();
  weekStartDate: Date = new Date();
  monthStartDate: Date = new Date();
  yearStartDate: Date = new Date();
  weekEndDate: Date = new Date();
  monthEndDate: Date = new Date();
  yearEndDate: Date = new Date();

  // Declare the properties for daily, weekly, monthly, and yearly stats
  dailyStats: any = {};
  weeklyStats: any = {};
  monthlyStats: any = {};
  yearlyStats: any = {};

  constructor(private api: ApiService, private auth: AuthService) { }

  ngOnInit(): void {
   /* this.api.getUsers().subscribe((res) => {
      this.users = res;
    });*/
    // get login ID from session storage
    //this.loginId = Number(sessionStorage.getItem('id'));
    this.loginId = Number(this.auth.getUserId());
    // set dates for this week, this month, and this year
    this.weekStartDate.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 1);
    this.weekEndDate.setDate(this.weekStartDate.getDate() + 6);
    this.monthStartDate.setDate(1);
    this.yearStartDate.setDate(1);
    this.yearEndDate.setMonth(11, 31);

    // fetch journeys for the login ID
    this.api.getJourneysByLoginId(this.loginId).subscribe({
      next: (data) => {
        this.journeys = data;
        // calculate total distance and duration for each period
        this.dailyStats = this.calculateStats('day');
        this.weeklyStats = this.calculateStats('week');
        this.monthlyStats = this.calculateStats('month');
        this.yearlyStats = this.calculateStats('year');
    
        console.log('Data:', data);
        // display stats
        console.log('Daily stats:', this.dailyStats);
        console.log('Weekly stats:', this.weeklyStats);
        console.log('Monthly stats:', this.monthlyStats);
        console.log('Yearly stats:', this.yearlyStats);
      },
      error: (error) => console.log(error)
    });
    
  }
  // calculate total distance and duration for a given period
  calculateStats(period: string) {
    const startDate = this.getStartDate(period);
    const endDate = this.getEndDate(period);
    
    const filteredJourneys = this.journeys.filter(journey =>
      startDate && endDate && new Date(journey.departure) >= startDate && new Date(journey.departure) <= endDate);    
    let totalDistance = 0;
    let totalDuration = 0;
    let count = 0;
   
    for (const journey of filteredJourneys) {
      totalDistance += journey.coveredDistanceInMeters / 1000;
      totalDuration += journey.durationInSeconds / 3600;
      count++;
    }
    const averageDistance = totalDistance / filteredJourneys.length || 0;
    const averageDuration = totalDuration / filteredJourneys.length || 0;

    return {
      period: period,
      startDate: startDate,
      endDate: endDate,
      totalDistance: totalDistance,
      totalDuration: totalDuration,
      averageDistance: averageDistance,
      averageDuration: averageDuration,
      count: count
    };
  }
 // get start date for a given period
 getStartDate(period: string) {
  switch (period) {
    case 'day':
      return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
    case 'week':
      const weekStartDate = new Date(this.currentDate);
      weekStartDate.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 1);
      return new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate());
    case 'month':
      return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    case 'year':
      return new Date(this.currentDate.getFullYear(), 0, 1);
    default:
      return null;
  }
}

 // get end date for a given period
 getEndDate(period: string) {
  switch (period) {
    case 'day':
      return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59, 59, 999);
    case 'week':
      const weekEndDate = new Date(this.currentDate);
      weekEndDate.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 7);
      return new Date(weekEndDate.getFullYear(), weekEndDate.getMonth(), weekEndDate.getDate(), 23, 59, 59, 999);
    case 'month':
      const monthEndDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
      return new Date(monthEndDate.getFullYear(), monthEndDate.getMonth(), monthEndDate.getDate(), 23, 59, 59, 999);
    case 'year':
      const yearEndDate = new Date(this.currentDate.getFullYear(), 11, 31);
      return new Date(yearEndDate.getFullYear(), yearEndDate.getMonth(), yearEndDate.getDate(), 23, 59, 59, 999);
    default:
      return null;
  }
}
}
