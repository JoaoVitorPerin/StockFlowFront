import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { ProdutoService } from '../produto.service';
import { ModalConfirmacaoService } from 'src/app/shared/components/modal-confirmacao/modal-confirmacao.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  columns: any;
  configuracoes: DatagridConfig = datagridConfigDefault();
  data: any = [];

  items: any[];
  home: any;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private produtoService: ProdutoService,
    private modalConfirmacaoService: ModalConfirmacaoService
  ) {
    this.columns = [
      {
        dataField: 'codigo',
        caption: 'Código',
        dataType: 'int',
        sorting: true,
      },
      {
        dataField: 'nome',
        caption: 'Nome',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'preco_compra',
        caption: 'Preço de Compra',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'preco_venda',
        caption: 'Preço de Venda',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'status',
        caption: 'Status',
        sorting: true,
        cellTemplate: 'boolean',
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
      tooltip: 'Editar Produto',
      click: (rowData): void => {
        this.router.navigate(['produto/cadastro/', rowData?.id])
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-times',
      color: 'danger',
      tooltip: 'Desativar Produto',
      show: (rowData): boolean => {
        return rowData?.status
      },
      click: (rowData): void => {
        this.alterarStatusProduto(rowData?.id);
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-check',
      color: 'success',
      tooltip: 'Ativar Produto',
      show: (rowData): boolean => {
        return !rowData?.status
      },
      click: (rowData): void => {
        this.alterarStatusProduto(rowData?.id);
      }
    })

    this.configuracoes.customButtons.push(
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Adicionar Produto',
        text: 'Adicionar',
        click: (): void => {
          this.router.navigate(['produto/cadastro']);
        }
      }
    )

    this.items = [
      { label: 'Gestão Admin' }, 
      { label: 'Produtos' }, 
      { label: 'Home' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  ngOnInit(): void {
    this.buscarProdutos();
  }

  buscarProdutos(): void {
    this.produtoService.buscarDadosProdutos().subscribe(
      (response) => {
        this.data = response.produtos ?? [];
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar produtos');
      }
    );
  }

  alterarStatusProduto(id: string): void {
    this.produtoService.alterarStatusProduto(id).subscribe(
      () => {
        this.toastrService.mostrarToastrSuccess(`Alterado status do produto com sucesso`);
        this.buscarProdutos();
      },
      () => {
        this.toastrService.mostrarToastrDanger('Erro ao alterar status do produto');
      }
    );
  }
}
