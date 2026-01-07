import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Generateurmdp } from './generateurmdp';

describe('Generateurmdp', () => {
  let component: Generateurmdp;
  let fixture: ComponentFixture<Generateurmdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generateurmdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Generateurmdp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
