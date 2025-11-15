import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Open } from './open';

describe('Open', () => {
  let component: Open;
  let fixture: ComponentFixture<Open>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Open]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Open);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
