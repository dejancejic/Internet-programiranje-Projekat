import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperaterComponent } from './operater.component';

describe('OperaterComponent', () => {
  let component: OperaterComponent;
  let fixture: ComponentFixture<OperaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperaterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
