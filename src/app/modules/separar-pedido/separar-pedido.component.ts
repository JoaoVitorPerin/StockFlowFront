import { SepararPedidoService } from './separar-pedido.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { CardSeparacaoComponent } from './card-separacao/card-separacao.component';

@Component({
  selector: 'app-separar-pedido',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardSeparacaoComponent
  ],
  templateUrl: './separar-pedido.component.html',
  styleUrl: './separar-pedido.component.scss'
})
export class SepararPedidoComponent implements OnInit{
  pedidosSeparacao: any = [];
  pedidosEmbalados: any = [];
  pedidosSaidaEstoque: any = [];

  constructor(
    private modalService: ModalService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private separarPedidoService: SepararPedidoService
  ) { }

  ngOnInit(){
    this.buscarPedidos();
  }

  buscarPedidos(){
    this.separarPedidoService.buscarDadosPedidos().subscribe((data) => {
      this.pedidosSeparacao = data?.pedidos.filter((pedido: any) => pedido.status === 'separacao');
      this.pedidosEmbalados = data?.pedidos.filter((pedido: any) => pedido.status === 'embalado');
      this.pedidosSaidaEstoque = data?.pedidos.filter((pedido: any) => pedido.status === 'saiu_estoque');
    });
  }
}
