import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerModalComponent } from './manufacturer-modal.component';

describe('ManufacturerModalComponent', () => {
  let component: ManufacturerModalComponent;
  let fixture: ComponentFixture<ManufacturerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
