import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustoAtletaComponent } from './custo-atleta.component';

describe('CustoAtletaComponent', () => {
  let component: CustoAtletaComponent;
  let fixture: ComponentFixture<CustoAtletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustoAtletaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustoAtletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
