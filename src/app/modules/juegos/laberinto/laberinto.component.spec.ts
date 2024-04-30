import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaberintoComponent } from './laberinto.component';

describe('LaberintoComponent', () => {
  let component: LaberintoComponent;
  let fixture: ComponentFixture<LaberintoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaberintoComponent]
    });
    fixture = TestBed.createComponent(LaberintoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
