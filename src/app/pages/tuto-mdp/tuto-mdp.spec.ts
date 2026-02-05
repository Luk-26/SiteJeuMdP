import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoMdp } from './tuto-mdp';

describe('TutoMdp', () => {
  let component: TutoMdp;
  let fixture: ComponentFixture<TutoMdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutoMdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutoMdp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
