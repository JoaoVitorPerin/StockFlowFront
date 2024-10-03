import { modal, modalBotoes } from './../../models/modal.model';
import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modais: Array<modal> = [];

  private tarefaAbrirModal = new Subject<any>();
  tarefaAbrirModal$ = this.tarefaAbrirModal.asObservable();

  private tarefaFecharModal = new Subject<any>();
  tarefaFecharModal$ = this.tarefaFecharModal.asObservable();

  private tarefaOnHide = new Subject<any>();
  tarefaOnHide$ = this.tarefaOnHide.asObservable();

  constructor() { }

  abrirModal(titulo: string, template: TemplateRef<any>, botoes?: Array<modalBotoes>, config?: any): any {

    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const dados = {
      titulo,
      template,
      botoes,
      config,
      hash
    }

    this.tarefaAbrirModal.next(dados)
    return {
      ...dados,
      onHide: this.tarefaOnHide$
    }
  }

  fecharModal(modal?): void {
    this.tarefaFecharModal.next(modal)
  }

  onHide(dados) {
    this.tarefaOnHide.next(dados)
  }


}
