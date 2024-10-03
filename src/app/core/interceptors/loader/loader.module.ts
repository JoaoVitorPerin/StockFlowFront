import { LoaderService } from './loader.service';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderService,
      multi: true,
    },
  ],
})
export class InterceptorLoaderModule { }
