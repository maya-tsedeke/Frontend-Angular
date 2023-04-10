import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/Services/api.service';
import ValidateForm from 'src/app/helper/validateform';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-creat-station',
  templateUrl: './creat-station.component.html',
  styleUrls: ['./creat-station.component.scss']
})
export class CreatStationComponent implements OnInit {
  @ViewChild('content') content: any = {};
  @Input() updatedValues: any;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  stationForm!: FormGroup;
  updateDisabled: boolean;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toast: NgToastService,
    private modalService: NgbModal,
    private activat: ActivatedRoute

  ) {
    const requestID=this.activat.snapshot.paramMap.get('id');
    let id = '';
      // Check if id is present in the route params
  if (requestID) {
    // Set id to the route param value
    id = requestID;
    // Disable the create button
    this.updateDisabled = true;
  }
    this.stationForm = this.fb.group({
      nimi: ['', Validators.required],
      namn: ['', Validators.required],
      name: ['', Validators.required],
      osoite: ['', Validators.required],
      address: ['', Validators.required],
      kaupunki: ['', Validators.required],
      stad: ['', Validators.required],
      operaattor: ['', Validators.required],
      kapasiteet: ['', Validators.required],
      x: [''],
      y: ['']
    });
    if (id) {
      this.stationForm.addControl('id', this.fb.control(id, Validators.required));
    }
    this.updateDisabled = false;
  }
  ID: number | undefined
  ngOnInit(): void {
    const getid = this.activat.snapshot.paramMap.get('id');
    console.log("Form Values ID", getid);
    this.activat.params.subscribe(params => {


      if (getid) {
        // Disable the create button
        this.updateDisabled = true;

        // Get the station data and set the form values

        const urlID = getid ? +getid : 0;
        this.ID = urlID;
        this.api.fetchStation(urlID).subscribe(station => {
          if (station && station.nimi) {
            this.stationForm.setValue({
              id: this.ID,
              nimi: station.nimi,
              namn: station.namn,
              name: station.name,
              osoite: station.osoite,
              address: station.address,
              kaupunki: station.kaupunki,
              stad: station.stad,
              operaattor: station.operaattor,
              kapasiteet: station.kapasiteet,
              x: station.x,
              y: station.y
            });
          }
        });
      }
    });
  }
  onSubmit(): void {
    this.stationForm.get('kapasiteet')?.setValue(this.stationForm.get('kapasiteet')?.value.toString());

    if (this.stationForm.valid) {
      const address =
        this.stationForm.get('osoite')?.value +
        ' ' +
        this.stationForm.get('kaupunki')?.value;
      const apiKey = 'KgIGtpHhW7NoeQ6qFSk4'; // Replace with your MapTiler API key
      const url = `https://api.maptiler.com/geocoding/Zurich.json?key=${apiKey}&q=${address}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.features.length > 0) {
            const longitude = data.features[0].geometry.coordinates[0];
            const latitude = data.features[0].geometry.coordinates[1];
            this.stationForm.get('x')?.setValue(longitude);
            this.stationForm.get('y')?.setValue(latitude);
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            console.log('Form Values:', this.stationForm.value);
            this.api.createStation(this.stationForm.value).subscribe({
              next: (res) => {
                console.log(res);
                this.toast.success({
                  detail: 'SUCCESS',
                  summary: 'Success',
                  duration: 5000,
                });
                this.router.navigate(['/station-list']);
              },
              error: (error) => {
                console.log('Error: ', error);
                if (error.status === 400) {
                  let errorDetail = '';
                  Object.keys(error.error.errors).forEach((key) => {
                    errorDetail += `${key}: ${error.error.errors[key]}<br>`;
                  });
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
              detail:
                'Could not find latitude and longitude for the given address',
              summary: 'Error',
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.toast.error({
            detail: 'Could not connect to the MapTiler API',
            summary: 'Error',
            duration: 5000,
          });
        });
    } else {
      // Display validation error messages
      ValidateForm.validateAllFormFields(this.stationForm);

      // Loop through each form control to display the corresponding error message
      Object.keys(this.stationForm.controls).forEach((field) => {
        const control = this.stationForm.get(field);

        if (control && control.errors) {
          const errors = control.errors;
          let errorMessage = '';

          // Display error message based on the type of error
          if (errors['required']) {
            errorMessage = 'One or more fields are required';
          } else if (errors['min'] || errors['max']) {
            errorMessage = 'Value out of range';
          } else {
            errorMessage = 'Invalid field';
          }
          // Display the error message using toast
          this.toast.error({
            detail: errorMessage,
            summary: 'Validation Error',
            duration: 5000,
          });
        }
      });
    }
  }

  update() {
    this.stationForm.get('kapasiteet')?.setValue(this.stationForm.get('kapasiteet')?.value.toString());

    if (this.stationForm.valid) {
      const address =
        this.stationForm.get('osoite')?.value +
        ' ' +
        this.stationForm.get('kaupunki')?.value;
      const apiKey = 'KgIGtpHhW7NoeQ6qFSk4'; // Replace with your MapTiler API key
      const url = `https://api.maptiler.com/geocoding/Zurich.json?key=${apiKey}&q=${address}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.features.length > 0) {
            const longitude = data.features[0].geometry.coordinates[0];
            const latitude = data.features[0].geometry.coordinates[1];
            this.stationForm.get('x')?.setValue(longitude);
            this.stationForm.get('y')?.setValue(latitude);
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            console.log('Form Values:', this.stationForm.value);
            const rowid = this.ID ? +this.ID : 0;
            console.log("UpdatSetValue", this.stationForm.value),
              this.api.updateStation(rowid, this.stationForm.value).subscribe({
                next: (res) => {
                  console.log(res);
                  this.toast.success({
                    detail: 'SUCCESS',
                    summary: 'Success',
                    duration: 5000,
                  });
                  this.stationForm.patchValue({
                    id: ''
                  });
                 
                  this.router.navigate(['/station-list']);
                },
                error: (error) => {
                  console.log('Error: ', error);
                  if (error.status === 400) {
                    let errorDetail = '';
                    Object.keys(error.error.errors).forEach((key) => {
                      errorDetail += `${key}: ${error.error.errors[key]}<br>`;
                    });
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
              detail:
                'Could not find latitude and longitude for the given address',
              summary: 'Error',
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.toast.error({
            detail: 'Could not connect to the MapTiler API',
            summary: 'Error',
            duration: 5000,
          });
        });
    } else {
      // Display validation error messages
      ValidateForm.validateAllFormFields(this.stationForm);

      // Loop through each form control to display the corresponding error message
      Object.keys(this.stationForm.controls).forEach((field) => {
        const control = this.stationForm.get(field);

        if (control && control.errors) {
          const errors = control.errors;
          let errorMessage = '';

          // Display error message based on the type of error
          if (errors['required']) {
            errorMessage = 'One or more fields are required';
          } else if (errors['min'] || errors['max']) {
            errorMessage = 'Value out of range';
          } else {
            errorMessage = 'Invalid field';
          }
          // Display the error message using toast
          this.toast.error({
            detail: errorMessage,
            summary: 'Validation Error',
            duration: 5000,
          });
        }
      });
    }
  }
  gotoList()
  {
    this.router.navigate(['/station-list']);
  }
}