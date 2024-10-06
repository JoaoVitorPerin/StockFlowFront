import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-datagrid-actions',
  templateUrl: './datagrid-actions.component.html',
  styleUrls: ['./datagrid-actions.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, OverlayPanelModule],
})
export class DatagridActionsComponent implements OnInit {
  private layoutService = inject(LayoutService);

  @Input() data: any;
  @Input() buttons: any;
  @Input() rowIndex: any;

  actions = signal([]);
  moreActions = signal([]);

  showMoreActions: boolean = false;

  constructor() {}

  ngOnInit() {
    this.createActionButtons();
  }

  createActionButtons() {

    const buttonRef = [];

    if(this.buttons?.length){
      for(const btn of this.buttons){
        if(!btn.show || (btn.show && btn.show(this.data))){
          buttonRef.push(btn)
        }
      }
    }

    this.actions.set(buttonRef);

    if (this.actions()?.length > 3 && this.layoutService.isDesktop()) {
      this.moreActions.set(this.actions()?.splice(2, this.actions()?.length));
    }

    if (this.layoutService.isMobile()) {
      if (this.actions()?.length == 1) {
        return;
      }
      this.moreActions.set(this.actions()?.splice(0, this.actions()?.length));
    }
  }

  toogleMoreActions() {
    this.showMoreActions = !this.showMoreActions;
  }

  clickAction(config) {
    config.click(this.data, this.rowIndex);
  }
}
