import { ModalConfirmacaoService } from './modal-confirmacao.service';
import { Component } from '@angular/core';
import { Subscription } from "rxjs";
import { ConfirmationService } from "primeng/api";
import { modalConfirmacaoOpcoes } from '../../models/modalConfirmacao.model';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.css']
})
export class ModalConfirmacaoComponent {

  subsModal: Subscription[] = []

  visible: boolean = false;

  header: string;
  showHeader: boolean;
  draggable: boolean;
  resizable: boolean;
  maximizable: boolean
  widthDesktop: number;
  widthMobile: number;

  config: modalConfirmacaoOpcoes

  constructor(private modalConfirmacaoService: ModalConfirmacaoService,
              private confirmationService: ConfirmationService){
  }

  ngOnInit(): void {
    this.subsModal.push(
      this.modalConfirmacaoService.tarefaAbrirModalConfirmacao$.subscribe(configuracao => {

        const config = configuracao?.config
        this.config = config

        this.confirmationService.confirm({
          header: configuracao.titulo,
          icon: '',
          message: configuracao.mensagem,
          acceptIcon: config.iconeAceitar,
          acceptLabel: config.textoAceitar ?? 'Confirmar',
          rejectIcon: config.iconeRejeitar,
          rejectLabel: config.textoRejeitar ?? 'Fechar',
          closeOnEscape: false,
          accept: () => {
            if(config.callbackAceitar)
              config.callbackAceitar();
          },
          reject: () => {
            if(config.callbackRejeitar)
              config.callbackRejeitar();
          }
        });
      })
    )
  }

  ngOnDestroy(): void {
    if(this.subsModal?.length){
      for(const sub of this.subsModal){
        sub?.unsubscribe();
      }
    }
  }



}
