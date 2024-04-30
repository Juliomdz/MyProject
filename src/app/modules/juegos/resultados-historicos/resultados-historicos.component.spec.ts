import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosHistoricosComponent } from './resultados-historicos.component';

describe('ResultadosHistoricosComponent', () => {
  let component: ResultadosHistoricosComponent;
  let fixture: ComponentFixture<ResultadosHistoricosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultadosHistoricosComponent]
    });
    fixture = TestBed.createComponent(ResultadosHistoricosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
