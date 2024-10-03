import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotNull } from './not-null.service';

@NgModule({
  providers: [
    NotNull,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotNull,
      multi: true,
    },
  ],
})

export class NotNullModule { }
