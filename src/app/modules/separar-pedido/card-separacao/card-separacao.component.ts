import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { converterStatusPedido } from 'src/app/shared/ts/util';
import { SepararPedidoService } from '../separar-pedido.service';

@Component({
  selector: 'app-card-separacao',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './card-separacao.component.html',
  styleUrl: './card-separacao.component.scss'
})
export class CardSeparacaoComponent {
  @Input() pedido: any;
  @Input() notButton: any;
  @Output() statusAlterado = new EventEmitter<void>();

  @ViewChild('modalPedido', { static: false }) modalPedido!: TemplateRef<any>;

  converterStatusPedido = converterStatusPedido;

  constructor(
    private readonly modalService: ModalService,
    private readonly separarPedidoService: SepararPedidoService,
    private toastrService : ToastrService
  ) { }

  abrirModalPedido(){
    const botoes = [
      {
        label: 'Cancelar',
        color: 'primary',
        link: true,
        onClick: () => {
          this.modalService.fecharModal();
        },
      },
      {
        label: `${this.notButton ? 'OK' : 'Alterar status'}`,
        color: 'primary',
        onClick: () => {
          if(!this.notButton){
            this.alterarStatusPedido();
          }else{
            this.modalService.fecharModal();
          }
        }
      }
    ];
  this.modalService.abrirModal(`Pedido Nº ${this.pedido?.idPedido ?? '--'} - ${this.converterStatusPedido(this.pedido?.status)}`, this.modalPedido, botoes,{larguraDesktop: '50'}); 
  }

  alterarStatusPedido(){
    this.separarPedidoService.alterarStatusPedido(this.pedido?.idPedido).subscribe((data) => {
      if(data.status){
        this.toastrService.mostrarToastrSuccess('Status do pedido alterado com sucesso!');
        this.modalService.fecharModal();
        this.statusAlterado.emit();
      }else{
        this.toastrService.mostrarToastrDanger(`${data?.mensagem ?? 'Erro ao alterar status do pedido'}`);
      }
    });
  } 

}
