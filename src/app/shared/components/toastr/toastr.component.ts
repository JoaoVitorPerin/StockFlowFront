import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from "./toastr.service";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.css']
})
export class ToastrComponent implements OnInit, OnDestroy {

  subs: Subscription[] = []

  width: string

  constructor(
    private toastrService: ToastrService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {

    if(window.innerWidth > 991){
      this.width = '35vw'
    } else {
      this.width = '80vw'
    }

    this.subs.push(
      this.toastrService.tarefaMostrarToastrSuccess$.subscribe(dados => {
        this.messageService.add({
          severity: 'success',
          summary: dados?.titulo ?? '',
          detail: dados?.mensagem ?? ''
        })
      })
    )

    this.subs.push(
      this.toastrService.tarefaMostrarToastrPrimary$.subscribe(dados => {
        this.messageService.add({
          severity: 'info',
          summary: dados?.titulo ?? '',
          detail: dados?.mensagem ?? ''
        })
      })
    )

    this.subs.push(
      this.toastrService.tarefaMostrarToastrWarning$.subscribe(dados => {
        this.messageService.add({
          severity: 'warn',
          summary: dados?.titulo ?? '',
          detail: dados?.mensagem ?? ''
        })
      })
    )

    this.subs.push(
      this.toastrService.tarefaMostrarToastrDanger$.subscribe(dados => {
        this.messageService.add({
          severity: 'error',
          summary: dados?.titulo ?? '',
          detail: dados?.mensagem ?? ''
        })
      })
    )

  }

  ngOnDestroy(): void {
    if(this.subs?.length){
      for(const sub of this.subs){
        sub.unsubscribe()
      }
    }
  }

}
