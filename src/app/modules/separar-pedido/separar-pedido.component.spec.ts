import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SepararPedidoComponent } from './separar-pedido.component';

describe('SepararPedidoComponent', () => {
  let component: SepararPedidoComponent;
  let fixture: ComponentFixture<SepararPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SepararPedidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SepararPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
