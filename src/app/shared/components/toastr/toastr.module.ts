import { ToastrComponent } from './toastr.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

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
  ]
})
export class ToastrModule { }
