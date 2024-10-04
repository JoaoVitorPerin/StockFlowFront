import { ToastrComponent } from './toastr.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@NgModule({
  declarations: [
    ToastrComponent
  ],
  imports: [
    CommonModule,
    ToastModule
  ],
  exports: [
    ToastrComponent
  ],
  providers: [
    MessageService,
  ],
})
export class ToastrModule { }
