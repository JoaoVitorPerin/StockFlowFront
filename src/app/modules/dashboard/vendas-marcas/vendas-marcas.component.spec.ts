/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VendasMarcasComponent } from './vendas-marcas.component';

describe('VendasMarcasComponent', () => {
  let component: VendasMarcasComponent;
  let fixture: ComponentFixture<VendasMarcasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendasMarcasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendasMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
