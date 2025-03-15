import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalfunctionTableComponent } from './malfunction-table.component';

describe('MalfunctionTableComponent', () => {
  let component: MalfunctionTableComponent;
  let fixture: ComponentFixture<MalfunctionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MalfunctionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalfunctionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
