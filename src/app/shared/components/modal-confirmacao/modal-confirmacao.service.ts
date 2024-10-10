
import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { modalConfirmacaoOpcoes } from '../../models/modalConfirmacao.model';

@Injectable({
  providedIn: 'root'
})
export class ModalConfirmacaoService {

  constructor() { }

  private tarefaAbrirModalConfirmacao = new Subject<any>();
  tarefaAbrirModalConfirmacao$ = this.tarefaAbrirModalConfirmacao.asObservable();

  abrirModalConfirmacao(titulo: string, mensagem: string, config?: modalConfirmacaoOpcoes): void {
    const dados = {
      titulo,
      mensagem,
      config
    }
    this.tarefaAbrirModalConfirmacao.next(dados)
  }
}
