import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScooterDetailsTabComponent } from './scooter-details-tab.component';

describe('ScooterDetailsTabComponent', () => {
  let component: ScooterDetailsTabComponent;
  let fixture: ComponentFixture<ScooterDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScooterDetailsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScooterDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
