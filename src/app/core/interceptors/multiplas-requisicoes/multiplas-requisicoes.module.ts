import { MultiplasRequisicoes } from './multiplas-requisicoes.service';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    MultiplasRequisicoes,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MultiplasRequisicoes,
      multi: true,
    },
  ],
})

export class MultiplasRequisicoesModule { }
