import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Journey, Station, UserInfo } from 'src/app/Interfaces/station-details';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.scss']
})
export class JourneysComponent implements OnInit {
  journeys: any[] = [];
  ;// Add this line
  form!: FormGroup;
  stations!: Station[];
  listStations!: Station[];
  limit = 50;
  page = 0;
  orderBy = 'name'; // Add initial value
  search = '';
  currentUserId = Number(this.auth.getUserId());
  completedJourneysCount!: number;
  public departureStationOptions: any[] = [];
  formattedTime: string = '';
  started: boolean = false;
  startTime!: number;
  timeFormat: string = '00:00:00';
  lengthInKiloMeters!: string;

  //selectedStation: Station | null = null;
  selectedStation: Station = {
    id: 0,
    nimi: '',
    namn: '',
    name: '',
    osoite: '',
    address: '',
    kaupunki: '',
    stad: '',
    operaattor: '',
    kapasiteet: '',
    message: () => { } // add a dummy function to message
  };


  constructor(private fb: FormBuilder, private api: ApiService, private toast: NgToastService
    , private auth: AuthService,
    private router: Router) {
    this.form = this.fb.group({
      departureStationId: ['', Validators.required],
    });
    //Store timer in local storage.
    const elapsedSeconds = localStorage.getItem('elapsedSeconds');
    if (elapsedSeconds) {
      this.timeFormat = this.formatTime(Number(elapsedSeconds));
    }

  }
  ngOnInit(): void {
    //Calling User travel history
    this.onStatus();
    // Subscribe to the listStations API to get all stations
    this.api.listStations(this.limit, this.page, this.orderBy, this.search).subscribe((stations: Station[]) => {
      this.stations = stations;
      this.listStations = stations; // Save all stations in a separate array
      this.departureStationOptions = stations;
      this.departureStationOptions = stations.map(station => ({ id: station.id, name: station.name }));
    });
  }

  startReturn(journeyId: number): void {
    const StationId = this.form.get('departureStationId')?.value;
    const returnStationId = StationId.id;
    const returnDateTime = new Date();
    if (window.confirm("Are you sure you want to return the station?")) {
      if (returnStationId) {
        this.api.returnJourney(returnStationId, returnDateTime, journeyId).subscribe({
          next: (res) => {
            this.toast.success({
              detail: 'SUCCESS',
              summary: 'Success',
              duration: 5000,
            });
            this.form.reset();
            this.stopTimer()
            this.onStatus();
          },
          error: (error) => {
            console.log('Error: ', error);
            if (error.status === 400) {
              let errorDetail = '';
              if (error.error && error.error.errors) {
                if (typeof error.error.errors === 'object') {
                  Object.keys(error.error.errors).forEach((key) => {
                    errorDetail += `${key}: ${error.error.errors[key]}<br>`;
                  });
                } else {
                  errorDetail = 'Validation error';
                }
              } else {
                errorDetail = 'Validation error';
              }
              this.toast.error({
                detail: errorDetail,
                summary: 'Validation Error',
                duration: 5000,
              });
            } else {
              this.toast.error({
                detail: 'Error occurred while returning journey. Please try again later.',
                summary: 'Error',
                duration: 5000,
              });
            }
          }
        });
      }
      else {
        this.toast.error({
          detail: ' Please search your return location and try again.',
          summary: 'Error',
          duration: 5000,
        });
      }
    }
    else {
      this.toast.error({
        detail: 'Operation cancelled by customer!.',
        summary: 'Error',
        duration: 5000,
      });
    }

  }
  onSubmit(): void {
    const departureStationId = this.form.get('departureStationId')?.value;
    if (departureStationId.id) {

      const stationid = departureStationId.id;
      const departureDateTime = new Date();
      this.api.startJourney(stationid, departureDateTime, this.currentUserId).subscribe({
        next: (res) => {
          console.log(res);
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Success',
            duration: 5000,
          });
          this.form.reset();
          this.startTimer();
          this.onStatus();
          this.form.patchValue({
            departureStationId: ''
          });
        },
        error: (error) => {
          console.log('Error: ', error);
          if (error.status === 400) {
            let errorDetail = '';
            if (error.error && error.error.errors) {
              if (typeof error.error.errors === 'object') {
                Object.keys(error.error.errors).forEach((key) => {
                  errorDetail += `${key}: ${error.error.errors[key]}<br>`;
                });
              } else {
                errorDetail = 'Validation error';
              }
            } else {
              errorDetail = 'Validation error';
            }
            this.toast.error({
              detail: errorDetail,
              summary: 'Validation Error',
              duration: 5000,
            });
          } else {
            this.toast.error({
              detail: 'Something went wrong',
              summary: 'Error',
              duration: 5000,
            });
          }
        },
      });
    } else {
      this.toast.error({
        detail: 'Please search your location.',
        summary: 'Error',
        duration: 5000,
      });
    }
  }
  onSelectStation(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (!selectElement || !selectElement.value) {
      return;
    }
    const selectedStationId = selectElement.value;
    const id = +selectedStationId;
    const selectedStation = this.stations.find(station => station.id == id);
  }

  onStatus() {
    this.api.getJourneysByLoginId(this.currentUserId).subscribe({
      next: (journeys: Journey[]) => {
        const mappedJourneys = journeys.map((journey: Journey) => {
          const departureStation: Station = {
            id: journey.departureStationId || 0,
            nimi: journey.departureStation ? journey.departureStation.nimi : '',
            namn: journey.departureStation ? journey.departureStation.namn : '',
            name: journey.departureStation ? journey.departureStation.name : '',
            osoite: '',
            address: journey.departureStation ? journey.departureStation.address : '',
            kaupunki: '',
            stad: '',
            operaattor: '',
            kapasiteet: '',
            message: () => { }
          };
          const returnStation: Station = {
            id: journey.returnStationId || 0,
            nimi: journey.returnStation ? journey.returnStation.nimi : '',
            namn: journey.returnStation ? journey.returnStation.namn : '',
            name: journey.returnStation ? journey.returnStation.name : '',
            osoite: '',
            address: journey.returnStation ? journey.returnStation.address : '',
            kaupunki: '',
            stad: '',
            operaattor: '',
            kapasiteet: '',
            message: () => { }
          };
          const users: UserInfo = {
            id: journey.users?.id || 0,
            firstname: journey.users ? journey.users.firstname : '',
            lastname: journey.users ? journey.users.lastname : '',
            username: journey.users ? journey.users.username : '',
            email: journey.users ? journey.users.email : '',
          };
          const trip: Journey = {
            id: journey.id || 0,
            departureStationId: journey.departureStationId || 0,
            returnStationId: journey.returnStationId || 0,
            coveredDistanceInMeters: journey.coveredDistanceInMeters || 0,
            durationInSeconds: journey.durationInSeconds || 0,
            departure: journey.departure || null,
            return: journey.return || null,
            users: journey.users || null
          };
          //Time conversion 
          const formattedTime = new Date(journey.durationInSeconds * 1000).toLocaleTimeString('en-US', { hour12: false });
          // meter to kilimeter
          const lengthInKiloMeters = journey.coveredDistanceInMeters > 1000 ? `${(journey.coveredDistanceInMeters / 1000).toFixed(2)} KM` : `${journey.coveredDistanceInMeters.toFixed(2)} M`;
          const completed = journey.returnStationId !== null && journey.return !== null && journey.returnStationId !== 0;
          return { departureStation, returnStation, users, completed, trip, formattedTime, lengthInKiloMeters };
        });
        // Sort the journeys based on the timestamp, with the latest first
        mappedJourneys.sort((a, b) => b.trip?.id - a.trip?.id);
        // Slice the array to only show the latest ten entries
        const latestJourneys = mappedJourneys.slice(0, 5);

        // Update the journeys array with the latest journeys

        this.journeys = latestJourneys;



        const completedJourneysCount = mappedJourneys.reduce((count, journey) => {
          return !journey.completed ? count + 1 : count;
        }, 0);
        this.completedJourneysCount = completedJourneysCount;

        if (completedJourneysCount > 0) {
          this.pouseTimer();
          this.startTimer();
        }

      },

      error: (err: any) => {
        this.toast.error({
          detail: err.error,
          summary: 'Error',
          duration: 5000,
        });
      }
    });
  }
  startTimer() {
    this.started = true;
    const lastStopTime = Number(localStorage.getItem('lastStopTime'));
    this.startTime = lastStopTime ? lastStopTime : new Date().getTime();
    const elapsedSeconds = Number(localStorage.getItem('elapsedSeconds')) || 0;
    this.timeFormat = this.formatTime(elapsedSeconds);
    setInterval(() => {
      if (this.started) {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - this.startTime) / 1000) + elapsedSeconds;
        this.timeFormat = this.formatTime(elapsedTime);
      }
    }, 1000);
  }


  stopTimer() {
    this.started = false;
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - this.startTime) / 1000);
    localStorage.setItem('elapsedSeconds', elapsedSeconds.toString());
    localStorage.setItem('lastStopTime', currentTime.toString());
    localStorage.removeItem('elapsedSeconds');
    localStorage.removeItem('lastStopTime');
  }
  pouseTimer() {
    this.started = true;
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - this.startTime) / 1000);
    localStorage.setItem('elapsedSeconds', elapsedSeconds.toString());
    localStorage.setItem('lastStopTime', currentTime.toString());
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedHours = this.padTime(hours);
    const formattedMinutes = this.padTime(minutes);
    const formattedSeconds = this.padTime(remainingSeconds);
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  padTime(time: number): string {
    return (time < 10) ? `0${time}` : `${time}`;
  }
}


