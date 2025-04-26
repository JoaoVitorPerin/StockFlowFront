import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { items } from 'src/app/shared/models/items.model';
import { ProdutoService } from '../../produto/produto.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { EstoqueService } from '../estoque/estoque.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { VendasCustosService } from './vendas-custos.service';
import { toLocaleFixed } from 'src/app/shared/ts/util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendas-custos',
  templateUrl: './vendas-custos.component.html',
  styleUrl: './vendas-custos.component.scss'
})
export class VendasCustosComponent {
  formFiltroAnomes: FormGroup;
  itensAnomes: items[] = [];

  dadosTabelaVendas: any[] = [];
  columnsTabelaVendas: any[];
  configuracoes: DatagridConfig = datagridConfigDefault();

  dadosTabelaCustosAtleta: any[] = [];
  columnsTabelaAtletas: any[];

  dadosTabelaCustoMensal: any[] = [];
  columnsTabelaCustoMensal: any[];

  dadosCards: any;

  subs: Subscription[] = [];

  toLocaleFixed = toLocaleFixed;
  parseFloat = parseFloat;

  constructor(
    private formBuilder: FormBuilder,
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
    this.subs.push(
      this.vendasCustosService.buscarTabelasVendas(anomes).subscribe(
        (response) => {
          this.dadosTabelaVendas = response?.vendas?.pedidos ? response.vendas.pedidos.filter((pedido) => !pedido.is_atleta) : [];
          this.dadosTabelaCustosAtleta = response?.vendas?.pedidos ? response.vendas.pedidos.filter((pedido) => pedido.is_atleta) : [];
          this.dadosTabelaCustoMensal = response?.vendas?.custos_mensais ?? [];
          this.dadosCards = response?.vendas?.cards ?? [];
        },
        (error) => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar vendas');
        }
      )
    );
  }

  getUltimos12Meses(): { label: string; value: number }[] {
    const anomesList: { label: string; value: number }[] = [];
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
  
    const currentDate = new Date();
  
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setFullYear(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
  
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const anomes = Number(`${year}${month.toString().padStart(2, "0")}`);
  
      anomesList.push({
        label: `${meses[date.getMonth()]} ${year}`,
        value: anomes
      });
    }
  
    return anomesList;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
