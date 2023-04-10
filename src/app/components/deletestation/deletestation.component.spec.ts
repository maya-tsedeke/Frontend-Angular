import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletestationComponent } from './deletestation.component';

describe('DeletestationComponent', () => {
  let component: DeletestationComponent;
  let fixture: ComponentFixture<DeletestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletestationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
