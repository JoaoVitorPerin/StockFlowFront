import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from "primeng/button";
import { ModalComponent } from "./modal.component";

@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
  ],
  exports: [
    ModalComponent
  ]
})
export class ModalModule { }
