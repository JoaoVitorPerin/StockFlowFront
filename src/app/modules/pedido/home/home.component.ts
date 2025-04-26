import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { PedidoService } from '../pedido.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  columns: any;
  configuracoes: DatagridConfig = datagridConfigDefault();
  data: any = [];
  items: any[];
  home: any;

  subs: Subscription[] = [];

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private pedidoService: PedidoService,
    private tokenService: TokenService,
    private modalConfirmacaoService: ModalConfirmacaoService
  ){
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
        dataField: 'vlr_total',
        caption: 'Valor Total',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'cliente',
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
      icon: 'pi pi-pencil',
      color: 'primary',
      tooltip: 'Editar Pedido',
      click: (rowData): void => {
        this.router.navigate(['pedido/cadastro/', rowData?.idPedido])
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-trash',
      color: 'danger',
      tooltip: 'Excluir Pedido',
      click: (rowData): void => {
        this.excluirPedido(rowData?.idPedido);
      }
    })

    this.configuracoes.customButtons.push(
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Adicionar Pedido',
        text: 'Adicionar',
        click: (): void => {
          this.router.navigate(['pedido/cadastro']);
        }
      }
    )

    this.items = [
      { label: 'Gestão de Pedidos' }, 
      { label: 'Pedido' }, 
      { label: 'Home' }
    ];

    this.home = { icon: 'pi pi-home'};
  }
  
  ngOnInit(): void {
    this.buscarPedidos()
  }

  buscarPedidos(): void {
    this.subs.push(
      this.pedidoService.buscarDadosPedidos().subscribe(
        (response) => {
          this.data = response.pedidos.map((item) => {
            return {
              ...item,
              cliente: item.cliente.nome_completo
            }
          })
        },
        (error) => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar pedidos');
        }
      )
    );
  }

  excluirPedido(id: string): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Atenção',
      `Deseja realmente deletar esse pedido?`,
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.subs.push(
            this.pedidoService.excluirPedido(id, this.tokenService.getJwtDecodedAccess()?.user_id).subscribe(
              () => {
                this.toastrService.mostrarToastrSuccess(`Pedido deletado com sucesso!`);
                this.buscarPedidos();
              },
              () => {
                this.toastrService.mostrarToastrDanger('Erro ao deletar pedido!');
              }
            )
          );
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}