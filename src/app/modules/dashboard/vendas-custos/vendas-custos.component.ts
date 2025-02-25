import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { items } from 'src/app/shared/models/items.model';
import { ProdutoService } from '../../produto/produto.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { EstoqueService } from '../estoque/estoque.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { VendasCustosService } from './vendas-custos.service';
import { toLocaleFixed } from 'src/app/shared/ts/util';

@Component({
  selector: 'app-vendas-custos',
  templateUrl: './vendas-custos.component.html',
  styleUrl: './vendas-custos.component.scss'
})
export class VendasCustosComponent {
  formFiltroAnomes: FormGroup;
  itensAnomes: items[] = [
    
  ];

  dadosTabelaVendas: any[] = [];
  columnsTabelaVendas: any[];
  configuracoes: DatagridConfig = datagridConfigDefault();

  dadosTabelaCustosAtleta: any[] = [];
  columnsTabelaAtletas: any[];

  dadosTabelaCustoMensal: any[] = [];
  columnsTabelaCustoMensal: any[];

  dadosCards: any;

  toLocaleFixed = toLocaleFixed;
  parseFloat = parseFloat;

  constructor(
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private toastrService: ToastrService,
    private vendasCustosService: VendasCustosService,
  ) {
    this.formFiltroAnomes = this.formBuilder.group({
      anomes: [null],
    });

    this.itensAnomes = this.getUltimos12Meses();

    this.columnsTabelaVendas = [
      {
        dataField: 'idPedido',
        caption: 'Nº Pedido',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'nm_cliente',
        caption: 'Cliente',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'dataPedido',
        caption: 'Data compra',
        dataType: 'string',
        cellTemplate: 'datetime',
        sorting: true,
      },
      {
        dataField: 'vlr_total',
        caption: 'Valor venda',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'vlr_frete',
        caption: 'Valor Frete',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'vlr_custo',
        caption: 'Valor custo',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'vlr_lucro',
        caption: 'Lucro',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'vlr_margem',
        caption: 'Margem',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'perc',
      }
    ];

    this.columnsTabelaAtletas = [
      {
        dataField: 'idPedido',
        caption: 'Nº Pedido',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'nm_cliente',
        caption: 'Cliente',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'dataPedido',
        caption: 'Data',
        dataType: 'string',
        cellTemplate: 'datetime',
        sorting: true,
      },
      {
        dataField: 'vlr_venda',
        caption: 'Valor venda',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'vlr_frete',
        caption: 'Valor Frete',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'vlr_custo',
        caption: 'Valor custo',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'vlr_lucro',
        caption: 'Lucro',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      }
    ];

    this.columnsTabelaCustoMensal = [
      {
        dataField: 'nome',
        caption: 'Nome',
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
        caption: 'Recorrente',
        dataType: 'string',
        cellTemplate: 'boolean',
        sorting: true,
      },
    ]

    this.formFiltroAnomes.get('anomes').setValue(this.itensAnomes[0].value);

    this.formFiltroAnomes.get('anomes').valueChanges.subscribe((value) => {
      if (value) {
        this.buscarVendas(value);
      }
    });

    this.buscarVendas(this.formFiltroAnomes.get('anomes').value);
  }

  buscarVendas(anomes: string): void {
    this.vendasCustosService.buscarTabelasVendas(anomes).subscribe(
      (response) => {
        this.dadosTabelaVendas = response?.vendas?.pedidos ? response.vendas.pedidos.filter((pedido) => !pedido.is_atleta) : [];
        this.dadosTabelaCustosAtleta = response?.vendas?.pedidos ? response.vendas.pedidos.filter((pedido) => pedido.is_atleta) : [];
        this.dadosTabelaCustoMensal = response?.vendas?.custos_mensais ?? [];
        this.dadosCards = response?.vendas?.cards ?? [];
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar vendas');
      });
  }

  getUltimos12Meses(): { label: string; value: number }[] {
    const currentDate = new Date();
    const anomesList: { label: string; value: number }[] = [];

    // Meses em português
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i); // Ajusta o mês para trás

        // Formatar como YYYYMM
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() retorna 0-11
        const anomes = Number(`${year}${month.toString().padStart(2, '0')}`);

        // Criar o objeto com label e value
        anomesList.push({
            label: `${meses[month - 1]} ${year}`,
            value: anomes
        });
    }

    return anomesList;
  }
}
