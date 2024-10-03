import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,

  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploaderModule { }
