import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentPriceComponent } from './rent-price.component';

describe('RentPriceComponent', () => {
  let component: RentPriceComponent;
  let fixture: ComponentFixture<RentPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
