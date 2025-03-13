import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalfunctionsComponent } from './malfunctions.component';

describe('MalfunctionsComponent', () => {
  let component: MalfunctionsComponent;
  let fixture: ComponentFixture<MalfunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalfunctionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalfunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
