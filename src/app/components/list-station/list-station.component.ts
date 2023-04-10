import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Station } from 'src/app/Interfaces/station-details';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-list-station',
  templateUrl: './list-station.component.html',
  styleUrls: ['./list-station.component.scss']

})
export class ListStationComponent implements OnInit {
  listStations!: Station[];
  rowLimit=100
  limit = 5;
  page = 3;
  orderBy:string = 'name'; // Add initial value
  search = '';

  rows: Station[] = [];
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Name', prop: 'name' },
    { name: 'Address', prop: 'address' },
    { name: 'City', prop: 'kaupunki' },
    { name: 'X', prop: 'x' },
    { name: 'Y', prop: 'y' },
    { name: 'Actions' }
  ];
  currentPage = 1;
  totalPages = 1;

  sortDirection: string = 'asc'; // Add initial value

  constructor(private api: ApiService,
    private router: Router,
    private toast: NgToastService) {

  }
  searchValue: string = '';

 
  view(row: any) {
    this.router.navigate(['/report', row.id]);
  }
  create() {
    this.router.navigate(['/creat-station']);
  }
  edit(row: any) {
    this.router.navigate(['/update-station', row.id]);
  }
  delete(row: Station): void {
    if (confirm('Are you sure you want to delete this station?')) {
      this.api.deleteStation(row.id).subscribe({
        next: () => {
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Success',
            duration: 5000,
          });
          // Remove the deleted row from the list
          this.listStations = this.listStations.filter(s => s.id !== row.id);
          // Re-apply the current filter to update the displayed rows
          this.applyFilter();
        },
        error: (err: any) => {
          console.log(err);
          this.toast.error({
            detail: 'Failed to delete station',
            summary: 'Error',
            duration: 5000,
          });
        }
      });
    }
  }

  ngOnInit(): void {
    this.getStations();
    this.api.listStations().subscribe(stations => {
      this.listStations = stations;
      this.rowLimit = stations.length; // set default value to length of fetched stations
    });
  }
getStations(): void {
  this.api.listStations(this.rowLimit, this.page, this.orderBy, this.search)
    .subscribe((stations: Station[]) => {
      // Filter the result set based on the search value
      let filteredStations = stations.filter((station: Station) => {
        return station.name.toLowerCase().includes(this.search.toLowerCase());
      });

      // Sort the filtered results based on the selected column and direction
      filteredStations.sort((a: Station, b: Station) => {
        let valueA = a[this.orderBy];
        let valueB = b[this.orderBy];

        // Convert string values to lowercase for case-insensitive sorting
        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });

      // Slice the filtered results to the specified limit and offset
      this.rows = filteredStations.slice(this.page, this.page + this.limit);

      // Calculate the total number of pages based on the filtered results
      this.totalPages = Math.ceil(filteredStations.length / this.limit);
    });
}
  applyFilter(): void {
    // reset offset and current page when applying new filter
  // reset offset and current page when applying new filter  
  this.rowLimit=this.rowLimit;
  this.page = 0;
  this.currentPage = 1;
  this.search = this.searchValue;
  this.getStations();
  }
  onRowLimitChange(): void {
    this.rowLimit = this.rowLimit;
    this.page = 0;
    this.currentPage = 1;
    this.getStations();
  }
  prevPage(): void {
    if (this.currentPage > 1) {
      this.page -= this.limit;
      this.currentPage--;
      this.getStations();
    }
  }

  nextPage(): void {
 
    if (this.currentPage < this.totalPages) {
      this.page += this.limit;
      this.currentPage++;
      this.getStations();
    }
  }
  sort(column: string) {

    if (column === this.orderBy) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = column;
      this.sortDirection = 'asc';
    }
  
    this.rows.sort((a, b) => {
      const valueA = typeof a[column] === 'string' ? a[column].toLowerCase() : a[column];
      const valueB = typeof b[column] === 'string' ? b[column].toLowerCase() : b[column];
  
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  
  
}
