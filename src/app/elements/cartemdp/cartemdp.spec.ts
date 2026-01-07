import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cartemdp } from './cartemdp';

describe('Cartemdp', () => {
  let component: Cartemdp;
  let fixture: ComponentFixture<Cartemdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cartemdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cartemdp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
