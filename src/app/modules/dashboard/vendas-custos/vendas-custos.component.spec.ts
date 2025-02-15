import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendasCustosComponent } from './vendas-custos.component';

describe('VendasCustosComponent', () => {
  let component: VendasCustosComponent;
  let fixture: ComponentFixture<VendasCustosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendasCustosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendasCustosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
