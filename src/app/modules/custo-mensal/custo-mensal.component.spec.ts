import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustoMensalComponent } from './custo-mensal.component';

describe('CustoMensalComponent', () => {
  let component: CustoMensalComponent;
  let fixture: ComponentFixture<CustoMensalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustoMensalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustoMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
