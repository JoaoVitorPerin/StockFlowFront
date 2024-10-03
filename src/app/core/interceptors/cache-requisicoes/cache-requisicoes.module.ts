import { CacheRequisicoes } from './cache-requisicoes.service';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    CacheRequisicoes,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheRequisicoes,
      multi: true,
    },
  ],
})

export class CacheRequisicoesModule { }
