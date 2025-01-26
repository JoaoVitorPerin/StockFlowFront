import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSeparacaoComponent } from './card-separacao.component';

describe('CardSeparacaoComponent', () => {
  let component: CardSeparacaoComponent;
  let fixture: ComponentFixture<CardSeparacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSeparacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardSeparacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
