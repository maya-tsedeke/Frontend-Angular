import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatStationComponent } from './creat-station.component';

describe('CreatStationComponent', () => {
  let component: CreatStationComponent;
  let fixture: ComponentFixture<CreatStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatStationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
