import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/Services/api.service';
import {StationAddress, StationDetails } from 'src/app/Interfaces/station-details';
import { EMPTY, catchError } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';

//declare const google: any;
@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss']
})
export class StationDetailsComponent implements OnInit {
  public stationDetails: StationDetails | null = null;
  public stationAddr: StationAddress | null = null;
  public displayedColumns: string[] = ['id', 'count', 'name', 'address'];
  departureStationsData: StationAddress[] = [];
  returnStationsData: StationAddress[] = [];
  public stationName = ''; 
  public stationAddress = '';
  public stationLocation = '';
  public departureJourneyCount = 0;
  public returnJourneyCount = 0;
  public averageDistanceOfDepartureJourneys = 0;
  public averageDistanceOfReturnJourneys = 0;
  public top5DepartureStations: { id: string, name: string, address: string, count: number }[] = [];
  public top5ReturnStations: { id: string, name: string, address: string, count: number }[] = [];
  constructor(private api: ApiService, 
    private route: ActivatedRoute,
    private router:Router,
    private toast: NgToastService,) {}
    selectedMonth: string = '';

  // OnInit lifecycle hook
  ngOnInit(): void {
    // Get id and month from route parameters
    const requestId = this.route.snapshot.paramMap.get('id');
    const id =  requestId ? +requestId : 0;
    const requestMonth = this.route.snapshot.queryParamMap.get('month');
    const month = 6;// requestMonth ? +requestMonth : 0;
    console.log('Report ID:', id);
      // Call the API to get station details
      this.api.getStationDetails(id.toString(), month.toString())
      .pipe(   
        catchError(() => {
          this.toast.error({
            detail: 'Failed to fetch station details',
            summary: 'Error',
            duration: 5000,
          });
        return EMPTY;
      }))
      .subscribe((data: StationDetails) => {

        this.stationDetails = data;
  
        // Set values for other properties
        this.stationName = data.name;
        this.stationAddress = data.address;
        this.stationLocation = `(${data.location.x}, ${data.location.y})`;
        this.departureJourneyCount = data.departureJourneyCount;
        this.returnJourneyCount = data.returnJourneyCount;
        this.averageDistanceOfDepartureJourneys = data.averageDistanceOfDepartureJourneys;
        this.averageDistanceOfReturnJourneys = data.averageDistanceOfReturnJourneys;

        // Set values for top 5 departure stations
        this.top5DepartureStations = this.getEntries(data.top5DepartureStations)
          .map(([id, count]) => ({
            id,
            count,
            name: '',
            address: ''
          }));
  
          this.api.getSingleStations(this.top5DepartureStations.map(station => station.id))
          .pipe(   
            catchError(() => {
              this.toast.error({
                detail: 'No journey',
                summary: 'Error',
                duration: 5000,
              });
            return EMPTY;
          }))
          .subscribe(stations => {
            console.log('Top 5 Departure Stations', stations);
            this.top5DepartureStations = this.top5DepartureStations.map(station => ({
              id: station.id?.toString() || '',
              count: station.count,
              name: stations.find(s => s.id === station.id)?.name || '',
              address: stations.find(s => s.id === station.id)?.address || ''
            }));
        });
        
        // Set values for top 5 return stations
        this.top5ReturnStations = this.getEntries(data.top5ReturnStations)
          .map(([id, count]) => ({
            id,
            count,
            name: '',
            address: ''
          }));
  
        this.api.getSingleStations(this.top5ReturnStations.map(station => station.id))
        .pipe(   
          catchError(() => {
            this.toast.error({
              detail: 'No journey',
              summary: 'Error',
              duration: 5000,
            });
          return EMPTY;
        }))
          .subscribe(stations => {
            this.top5ReturnStations = this.top5ReturnStations.map(station => ({
              id: station.id?.toString() || '',
              count: station.count,
              name: stations.find(s => s.id === station.id)?.name || '',
              address: stations.find(s => s.id === station.id)?.address || ''
            }));
        });
      });
      
  }
 
// Helper function to get entries from an object
getEntries(obj: any): [string, any][] {
  return Object.entries(obj as {[key: string]: number}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }
}
 
