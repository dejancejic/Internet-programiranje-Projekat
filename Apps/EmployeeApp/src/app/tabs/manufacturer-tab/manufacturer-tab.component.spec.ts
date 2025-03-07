import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerTabComponent } from './manufacturer-tab.component';

describe('ManufacturerTabComponent', () => {
  let component: ManufacturerTabComponent;
  let fixture: ComponentFixture<ManufacturerTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
