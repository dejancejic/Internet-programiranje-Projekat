import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorHeaderComponent } from './operator-header.component';

describe('OperatorHeaderComponent', () => {
  let component: OperatorHeaderComponent;
  let fixture: ComponentFixture<OperatorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
