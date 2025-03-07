import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarTabComponent } from './car-tab.component';

describe('CarTabComponent', () => {
  let component: CarTabComponent;
  let fixture: ComponentFixture<CarTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
