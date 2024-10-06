import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatagridActionsComponent } from './datagrid-actions.component';

describe('DatagridActionsComponent', () => {
  let component: DatagridActionsComponent;
  let fixture: ComponentFixture<DatagridActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatagridActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatagridActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
