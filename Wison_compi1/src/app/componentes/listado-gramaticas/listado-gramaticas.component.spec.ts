import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoGramaticasComponent } from './listado-gramaticas.component';

describe('ListadoGramaticasComponent', () => {
  let component: ListadoGramaticasComponent;
  let fixture: ComponentFixture<ListadoGramaticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoGramaticasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoGramaticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
