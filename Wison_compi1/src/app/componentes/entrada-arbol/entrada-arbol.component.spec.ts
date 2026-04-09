import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaArbolComponent } from './entrada-arbol.component';

describe('EntradaArbolComponent', () => {
  let component: EntradaArbolComponent;
  let fixture: ComponentFixture<EntradaArbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaArbolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaArbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
