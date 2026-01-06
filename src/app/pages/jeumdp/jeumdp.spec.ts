import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jeumdp } from './jeumdp';

describe('Jeumdp', () => {
  let component: Jeumdp;
  let fixture: ComponentFixture<Jeumdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jeumdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jeumdp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
