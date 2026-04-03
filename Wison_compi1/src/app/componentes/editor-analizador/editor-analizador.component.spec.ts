import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAnalizadorComponent } from './editor-analizador.component';

describe('EditorAnalizadorComponent', () => {
  let component: EditorAnalizadorComponent;
  let fixture: ComponentFixture<EditorAnalizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorAnalizadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorAnalizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
