import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeTabComponent } from './bike-tab.component';

describe('BikeTabComponent', () => {
  let component: BikeTabComponent;
  let fixture: ComponentFixture<BikeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
