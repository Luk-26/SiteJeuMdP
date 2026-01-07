import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testeurmdp } from './testeurmdp';

describe('Testeurmdp', () => {
  let component: Testeurmdp;
  let fixture: ComponentFixture<Testeurmdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testeurmdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Testeurmdp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
