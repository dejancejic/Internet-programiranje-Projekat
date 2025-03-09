import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScooterTabComponent } from './scooter-tab.component';

describe('ScooterTabComponent', () => {
  let component: ScooterTabComponent;
  let fixture: ComponentFixture<ScooterTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScooterTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScooterTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
