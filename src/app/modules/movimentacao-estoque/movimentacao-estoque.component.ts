import { ToastrService } from './../../shared/components/toastr/toastr.service';
import { ProdutoService } from './../produto/produto.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProdutoRoutingModule } from '../produto/produto-routing.module';
import { DatagridModule } from 'src/app/shared/components/datagrid/datagrid.module';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';

@Component({
  selector: 'app-movimentacao-estoque',
  standalone: true,
  imports: [
    CommonModule,
    ProdutoRoutingModule,
    DatagridModule,
    CardModule,
    BreadcrumbModule
  ],
  templateUrl: './movimentacao-estoque.component.html',
  styleUrl: './movimentacao-estoque.component.scss'
})
export class MovimentacaoEstoqueComponent {
  columns: any;
  configuracoes: DatagridConfig = datagridConfigDefault();
  data: any = [];

  items: any[];
  home: any;

  constructor(
    private produtoService: ProdutoService,
    private toastrService: ToastrService
  ){
    this.items = [
      { label: 'Estoque' }, 
      { label: 'Movimentações' }, 
      { label: 'Home' }
    ];

    this.columns = [
      {
        dataField: 'tipo',
        caption: 'Tipo',
        dataType: 'string',
        cellTemplate: 'movimentacao',
        sorting: true,
        fixed: true
      },
      {
        dataField: 'data_movimentacao',
        caption: 'Data',
        dataType: 'date',
        cellTemplate: 'datetime',
        sorting: true,
      },
      {
        dataField: 'produto__nome',
        caption: 'Produto',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'quantidade',
        caption: 'Quantidade',
        dataType: 'int',
        sorting: true,
      },
      {
        dataField: 'user',
        caption: 'Usuário',
        dataType: 'string',
        sorting: true,
      },
    ];

    this.buscarDadosMovimentacoes();

    this.home = { icon: 'pi pi-home'};
  }

  buscarDadosMovimentacoes() {
    this.produtoService.historicoMovimentacaoEstoque().subscribe((response) => {
      if(response.status){
        this.data = response.movimentacao;
      }else{
        this.toastrService.mostrarToastrPrimary(response.descricao ?? 'Erro ao buscar dados de movimentações de estoque');
      }
    },
    (error) => {
      console.log(error);
    });
  }
}
