import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmacaoComponent } from './modal-confirmacao.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from "primeng/button";
import { AtalhoEventoDirective } from '../../directives/atalho-evento.directive';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    AtalhoEventoDirective
  ],
  providers: [ConfirmationService],
  exports: [ModalConfirmacaoComponent],
  declarations: [ModalConfirmacaoComponent]
})
export class ModalConfirmacaoModule { }
