import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeDetailsTabComponent } from './bike-details-tab.component';

describe('BikeDetailsTabComponent', () => {
  let component: BikeDetailsTabComponent;
  let fixture: ComponentFixture<BikeDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeDetailsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
