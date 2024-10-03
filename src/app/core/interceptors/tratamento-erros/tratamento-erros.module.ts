import { TratamentoErrosService } from './tratamento-erros.service';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    TratamentoErrosService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TratamentoErrosService,
      multi: true,
    },
  ],
})
export class TratamentoErrosModule { }
