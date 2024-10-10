import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor() { }

  private tarefaMostrarToastrSuccess = new Subject<any>();
  tarefaMostrarToastrSuccess$ = this.tarefaMostrarToastrSuccess.asObservable();

  private tarefaMostrarToastrPrimary = new Subject<any>();
  tarefaMostrarToastrPrimary$ = this.tarefaMostrarToastrPrimary.asObservable();

  private tarefaMostrarToastrWarning = new Subject<any>();
  tarefaMostrarToastrWarning$ = this.tarefaMostrarToastrWarning.asObservable();

  private tarefaMostrarToastrDanger = new Subject<any>();
  tarefaMostrarToastrDanger$ = this.tarefaMostrarToastrDanger.asObservable();

  mostrarToastrSuccess(mensagem: string, titulo?: string): void {

    const dados = {
      titulo: titulo,
      mensagem: mensagem
    }

    this.tarefaMostrarToastrSuccess.next(dados)
  }

  mostrarToastrPrimary(mensagem: string, titulo?: string): void {

    const dados = {
      titulo: titulo,
      mensagem: mensagem
    }

    this.tarefaMostrarToastrPrimary.next(dados)
  }

  mostrarToastrWarning(mensagem: string, titulo?: string): void {

    const dados = {
      titulo: titulo,
      mensagem: mensagem
    }

    this.tarefaMostrarToastrWarning.next(dados)
  }

  mostrarToastrDanger(mensagem: string, titulo?: string): void {
    const dados = {
      titulo: titulo,
      mensagem: mensagem
    }

    this.tarefaMostrarToastrDanger.next(dados)
  }
}
