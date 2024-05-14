import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatematicaComponent } from './matematica.component';

describe('MatematicaComponent', () => {
  let component: MatematicaComponent;
  let fixture: ComponentFixture<MatematicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatematicaComponent]
    });
    fixture = TestBed.createComponent(MatematicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
