import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaComponent } from './marca.component';

describe('MarcaComponent', () => {
  let component: MarcaComponent;
  let fixture: ComponentFixture<MarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
