import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeExitoComponent } from './informe-exito.component';

describe('InformeExitoComponent', () => {
  let component: InformeExitoComponent;
  let fixture: ComponentFixture<InformeExitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeExitoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeExitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
