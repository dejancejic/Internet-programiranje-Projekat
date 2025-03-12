import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDetailsTabComponent } from './car-details-tab.component';

describe('CarDetailsTabComponent', () => {
  let component: CarDetailsTabComponent;
  let fixture: ComponentFixture<CarDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDetailsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
