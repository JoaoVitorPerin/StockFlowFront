import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { PedidoService } from '../pedido.service';

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

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private pedidoService: PedidoService,
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
        cellTemplate: 'date'
      },
      {
        dataField: 'vlrTotal',
        caption: 'Valor Total',
        dataType: 'string',
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

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  
  ngOnInit(): void {
    this.buscarPedidos()
  }

  buscarPedidos(): void {
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
    );
  }

  excluirPedido(id: string): void {
    this.pedidoService.excluirPedido(id).subscribe(
      () => {
        this.toastrService.mostrarToastrSuccess(`Alterado status do pedido com sucesso`);
        this.buscarPedidos();
      },
      () => {
        this.toastrService.mostrarToastrDanger('Erro ao alterar status do pedido');
      }
    );
  }

}