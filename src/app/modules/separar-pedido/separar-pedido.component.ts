import { SepararPedidoService } from './separar-pedido.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { CardSeparacaoComponent } from './card-separacao/card-separacao.component';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { converterStatusPedido } from 'src/app/shared/ts/util';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';

@Component({
  selector: 'app-separar-pedido',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardSeparacaoComponent,
    DatagridModule,
    BreadcrumbModule
  ],
  templateUrl: './separar-pedido.component.html',
  styleUrl: './separar-pedido.component.scss'
})
export class SepararPedidoComponent implements OnInit{
  pedidosSeparacao: any = [];
  pedidosEmbalados: any = [];
  pedidosSaidaEstoque: any = [];

  pedidosSelecionados: any = [];

  columns: any;
  configuracoes: DatagridConfig = datagridConfigDefault();
  data: any = [];
  items: any[];
  home: any;

  pedido: any;

   @ViewChild('modalPedido', { static: false }) modalPedido!: TemplateRef<any>;

  converterStatusPedido = converterStatusPedido;

  constructor(
    private modalService: ModalService,
    private modalConfirmacaoService: ModalConfirmacaoService,
    private separarPedidoService: SepararPedidoService,
    private toastrService : ToastrService
  ) { }

  ngOnInit(){
    this.configuracoes.selectionMode = true;

    this.configuracoes.customButtons.push({
      icon: 'pi pi-check',
      color: 'success',
      tooltip: 'Alterar status',
      text: 'Alterar status',
      click: () => {
        this.alterarStatusVariosPedidos();
      }
    })

    this.buscarPedidos();

    this.columns = [
      {
        dataField: 'idPedido',
        caption: 'ID',
        dataType: 'int',
        sorting: true,
      },
      {
        dataField: 'dataPedido',
        caption: 'Data do pedido',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'datetime'
      },
      {
        dataField: 'nome_cliente',
        caption: 'Cliente',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'acoes',
        caption: 'Ações',
        fixed: true,
        width: '100px',
      },
    ];

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-eye',
      color: 'primary',
      tooltip: 'Visualizar Pedido',
      click: (rowData): void => {
        this.abrirModalPedido(rowData);
      }
    })

    this.items = [
      { label: 'Gestão de Pedidos' }, 
      { label: 'Separação' }    
    ];

    this.home = { icon: 'pi pi-home'};
  }

  buscarPedidos(){
    this.separarPedidoService.buscarDadosPedidos().subscribe((data) => {
      this.pedidosSeparacao = data?.pedidos.filter((pedido: any) => pedido.status === 'separacao').map((pedido: any) => {
        return {
          ...pedido,
          nome_cliente: pedido.cliente.nome_completo
        }
      });
    });
  }

  abrirModalPedido(pedido){
    this.pedido = pedido;
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
        label: `${'Alterar status'}`,
        color: 'primary',
        onClick: () => {
          this.alterarStatusPedido(pedido);
        }
      }
    ];
  this.modalService.abrirModal(`Pedido Nº ${pedido?.idPedido ?? '--'} - ${this.converterStatusPedido(pedido?.status)}`, this.modalPedido, botoes,{larguraDesktop: '50'}); 
  }

  alterarStatusPedido(pedido){
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Atenção',
      `Deseja realmente alterar o status desse pedido?`,
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.separarPedidoService.alterarStatusPedido([pedido?.idPedido]).subscribe((data) => {
            if(data.status){
              this.toastrService.mostrarToastrSuccess('Status do pedido alterado com sucesso!');
              this.modalService.fecharModal();
              this.buscarPedidos();
            }else{
              this.toastrService.mostrarToastrDanger(`${data?.mensagem ?? 'Erro ao alterar status do pedido'}`);
            }
          });
        }
      }
    );
  } 

  alterarStatusVariosPedidos(){
    if(!this.pedidosSelecionados.length)
      return this.toastrService.mostrarToastrDanger('Selecione ao menos um pedido para alterar o status');

    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Atenção',
      `Deseja realmente alterar o status desses pedidos?`,
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.separarPedidoService.alterarStatusPedido(this.pedidosSelecionados).subscribe((data) => {
            if(data.status){
              this.toastrService.mostrarToastrSuccess('Status do pedidos alterados com sucesso!');
              this.modalService.fecharModal();
              this.buscarPedidos();
            }else{
              this.toastrService.mostrarToastrDanger(`${data?.mensagem ?? 'Erro ao alterar status dos pedidos'}`);
            }
          });
        }
      }
    );
  }

  dadosSelectedPedidos(event){
    this.pedidosSelecionados = event.map((pedido: any) => pedido.idPedido);
  }
}
