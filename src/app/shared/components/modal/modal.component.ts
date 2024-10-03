import { modalBotoes, modalOpcoes } from './../../models/modal.model';
import { Subscription } from 'rxjs';
import { ModalService } from './modal.service';
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Dialog } from "primeng/dialog";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  @ViewChild ('template') template: TemplateRef<any>;
  @ViewChild ('dialog') dialog: Dialog;

  subsModal: Subscription[] = []
  modais: Array<modalOpcoes> = [];
  visible: boolean = false;

  constructor(private modalService: ModalService){}

  ngOnInit(): void {
    this.modalService.tarefaAbrirModal$.subscribe(dados => {
      const obj: modalOpcoes = {
        titulo:  dados?.titulo,
        template:  dados?.template,
        isArrastar:  dados?.config?.isArrastar,
        isRedimensionar:  dados?.config?.isRedimensionar,
        isMaximizar:  dados?.config?.isMaximizar,
        isCabecalho:  dados?.config?.isCabecalho,
        isFechar:  dados?.config?.isFechar,
        larguraMobile:  dados?.config?.larguraMobile ?? '95' ,
        larguraDesktop:  dados?.config?.larguraDesktop ?? '60',
        botoes: dados?.botoes,
        hash: dados?.hash,
        context: dados?.config?.context,
        onHide: dados?.config?.onHide,
        isMaximizado:  dados?.config?.isMaximizado,
        visible: true
      }
      this.modais.push(obj)
    })

    this.modalService.tarefaFecharModal$.subscribe((modalFechar) => {

      if(modalFechar){
        this.modalService.onHide(modalFechar.hash)
        this.modais = this.modais.filter(modal => modal.hash !== modalFechar.hash)
        return
      }

      this.modalService.onHide(this.modais[this.modais.length - 1]?.hash)
      this.modais.pop();
    })
  }

  ngOnDestroy(): void {
    if(this.subsModal?.length){
      for(const sub of this.subsModal){
        sub?.unsubscribe();
      }
    }
  }

  acoesClick(botao: modalBotoes): void {

    botao?.onClick();

    if(!botao?.manterModalAberta)
      this.modalService.fecharModal()

  }

  eventosModal(ev): void {
    if(ev === 'Escape')
      this.fecharModal()
    if(ev === 'F11')
      this.dialog.maximized = !this.dialog.maximized
  }

  eventosBotoesModal(ev): void {
    const modal = this.modais[this.modais.length - 1]
    if(modal?.botoes?.length){
      const botao = modal?.botoes?.find(botao => {return botao.atalho === ev})
      if(botao?.onClick)
        botao.onClick()
    }
  }

  fecharModalX(modal): void {
    this.modalService.onHide(this.modais[this.modais.length - 1].hash)
    this.modais.pop();
    if(modal?.onHide)
      modal?.onHide()
  }

  fecharModal(): void {
    this.modalService.onHide(this.modais[this.modais.length - 1].hash)
    this.modais.pop();
  }

  onShowModal(dialog: Dialog, config: modalOpcoes): void {
    if(config?.isMaximizado && dialog?.maximize)
      dialog.maximize()
  }

}
