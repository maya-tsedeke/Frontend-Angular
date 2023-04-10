import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Station } from 'src/app/Interfaces/station-details';

@Component({
  selector: 'app-deletestation',
  template: `
    <button class="btn btn-sm btn-danger" title="Delete" (click)="deleteClicked.emit()">
      <span class="bi bi-trash"></span>
    </button>
  `,
  styleUrls: ['./deletestation.component.scss']
})
export class DeletestationComponent {
  @Input() row!: Station;
  @Output() deleteClicked = new EventEmitter<Station>();
}
