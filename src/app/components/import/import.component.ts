import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  fileSelector: string = '';
  loading: boolean = false; // Initialize the flag to false
  constructor(private api: ApiService, private toast: NgToastService) { }
  ngOnInit(): void {

  }
  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    let apiUrl = '';
    if (!this.selectedFile) {
      this.toast.error({
        detail: 'Please select the file from the device.',
        summary: 'Error',
        duration: 50000
      });
      return;
    }
    const dataType = document.querySelector('input[name="dataType"]:checked') as HTMLInputElement;
    if (!dataType) {
      this.toast.error({
        detail: 'Database entity not selected. Please, select data type',
        summary: 'Error',
        duration: 50000
      });
      return;
    }
    if (dataType.value === 'station') {
      apiUrl = 'Stations';
    }
    if (dataType.value === 'journey') {
      apiUrl = 'Journeys';
    }
    const formData = new FormData();
    // Add each file to the form data object
    formData.append('file', this.selectedFile, this.selectedFile.name);
    // Set the loading flag to true
    this.loading = true;
    // Send the form data to the server using the HttpClient
    this.api.importData(formData, apiUrl).subscribe({
      next: (res: any) => {
        this.loading = false;
        if ('message' in res) {
          const message = res.message;
          console.log(" Handle success", message);
          this.toast.success({
            detail: message,
            summary: 'Success',
            duration: 5000,
          });
        } else {
          // Set the loading flag back to false
          this.loading = false;
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Success',
            duration: 5000,
          });
        }
      },
      error: (err) => {
        // Handle error
        // Set the loading flag back to false
        this.loading = false;
        this.toast.error({
          detail: err.error,
          summary: 'Error',
          duration: 5000,
        });
      }
    });
  }
}
