import { ModalConfirmacaoService } from './../../../shared/components/modal-confirmacao/modal-confirmacao.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { ProdutoService } from '../../produto/produto.service';
import { CustoMensalService } from '../custo-mensal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  columns: any;
  configuracoes: DatagridConfig = datagridConfigDefault();
  data: any = [];
  anomes: any;

  items: any[];
  home: any;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private custoMensalService: CustoMensalService,
    private modalConfirmacaoService: ModalConfirmacaoService,
  ) {
    this.anomes = new Date().toISOString().slice(0, 7).replace('-', '');

    this.columns = [
      {
        dataField: 'nome',
        caption: 'Descrição',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'valor',
        caption: 'Valor',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'recorrente',
        caption: 'Recorrente?',
        dataType: 'string',
        cellTemplate: 'boolean',
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
      tooltip: 'Editar Custo',
      click: (rowData): void => {
        this.router.navigate(['custo-mensal/cadastro/', rowData?.id])
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-trash',
      color: 'danger',
      tooltip: 'Excluir Custo',
      click: (rowData): void => {
        this.excluirCusto(rowData?.id);
      }
    })

    this.configuracoes.customButtons.push(
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Adicionar Custo',
        text: 'Adicionar',
        click: (): void => {
          this.router.navigate(['custo-mensal/cadastro']);
        }
      }
    )

    this.items = [
      { label: 'Gestão Admin' }, 
      { label: 'Custo mensal' }, 
      { label: 'Home' }
    ];

    this.home = { icon: 'pi pi-home'};
  }

  ngOnInit(): void {
    this.buscarCustos();
  }

  buscarCustos(): void {
    this.custoMensalService.buscarTodosCustos(this.anomes).subscribe(
      (response) => {
        this.data = response.custos ?? [];
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar custos');
      }
    );
  }

  excluirCusto(id: string): void {
    this.modalConfirmacaoService.abrirModalConfirmacao(
      'Atenção',
      `Deseja realmente deletar esse custo?`,
      {
        icone: 'pi pi-info-circle',
        callbackAceitar: () => {
          this.custoMensalService.excluirCusto(id).subscribe(
            (response) => {
              this.toastrService.mostrarToastrSuccess('Custo excluído com sucesso');
              this.buscarCustos();
            },
            (error) => {
              this.toastrService.mostrarToastrDanger('Erro ao excluir custo');
            }
          );
        }
      }
    );
    
  }
}
