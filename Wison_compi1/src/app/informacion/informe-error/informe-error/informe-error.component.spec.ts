import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeErrorComponent } from './informe-error.component';

describe('InformeErrorComponent', () => {
  let component: InformeErrorComponent;
  let fixture: ComponentFixture<InformeErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
