import { ClienteService } from './../../cliente/cliente.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { items } from 'src/app/shared/models/items.model';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { toLocaleFixed } from 'src/app/shared/ts/util';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { CustoAtletaService } from './custo-atleta.service';

@Component({
  selector: 'app-custo-atleta',
  templateUrl: './custo-atleta.component.html',
  styleUrl: './custo-atleta.component.scss'
})
export class CustoAtletaComponent {
  formFiltroAnomes: FormGroup;
  itensAnomes: items[] = [];
  itensAtletas: items[] = [];

  dadosTabelaVendas: any[] = [];
  columnsTabelaVendas: any[];
  configuracoes: DatagridConfig = datagridConfigDefault();
  configuracoesVendas: DatagridConfig = datagridConfigDefault();

  dadosTabelaCustosAtleta: any[] = [];
  columnsTabelaAtletas: any[];

  dadosTabelaCustoMensal: any[] = [];
  columnsTabelaCustoMensal: any[];

  dadosCards: any = {
    vlr_total: 0,
    vlr_total_lucro_liquido: 0,
  };

  toLocaleFixed = toLocaleFixed;
  parseFloat = parseFloat;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private clienteService: ClienteService,
    private custoAtletaService: CustoAtletaService
  ) {
    this.formFiltroAnomes = this.formBuilder.group({
      anomes: [null],
      atleta_id: [null],
    });

    this.itensAnomes = this.getUltimos12Meses();

    this.buscarAtletas();

    this.configuracoesVendas.rowClick = (e) => {
      this.formFiltroAnomes.get('atleta_id').setValue(e.id_indicacao);
    }

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
        dataField: 'nm_indicacao',
        caption: 'Atleta',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'qtd_indicacao',
        caption: 'Qtd.',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'vlr_total',
        caption: 'Vlr. Total',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'vlr_total_lucro_pedidos',
        caption: 'Lucro total',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'vlr_custo',
        caption: 'Custo',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'vlr_lucro_total',
        caption: 'Lucro líquido',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true
      }
    ];

    this.formFiltroAnomes.get('anomes').setValue(this.itensAnomes[0].value);

    this.formFiltroAnomes.get('anomes').valueChanges.subscribe((value) => {
      this.dadosTabelaVendas = [];
      this.dadosTabelaCustosAtleta = [];

      this.resetDadosCards();

      if (value) {
        this.buscarDadosAtletas(value, this.formFiltroAnomes.get('atleta_id').value ?? '');
      }
    });

    this.formFiltroAnomes.get('atleta_id').valueChanges.subscribe((value) => {
      this.dadosTabelaCustoMensal = [];
      this.dadosTabelaVendas = [];

      this.resetDadosCards();
      
      if (value) {
        this.buscarDadosAtletas(this.formFiltroAnomes.get('anomes').value, value);
      }else{
        this.buscarDadosAtletas(this.formFiltroAnomes.get('anomes').value);
      }
    });

    this.buscarDadosAtletas(this.formFiltroAnomes.get('anomes').value);
  }

  buscarDadosAtletas(anomes: string, atleta_id?: string): void {
    const data: any = {};
    data.anomes = anomes;

    if (atleta_id) {
      data.atleta_id = atleta_id;
    }

    this.custoAtletaService.buscarTabelaAtletas(data).subscribe(
      (response) => {
        if(atleta_id){
          this.dadosTabelaVendas = response.atletas;
          this.dadosCards.vlr_total_lucro_liquido = response.atletas.reduce((acc, atleta) => acc + parseFloat(atleta.vlr_lucro), 0);
          this.dadosCards.vlr_total = response.atletas.reduce((acc, atleta) => acc + parseFloat(atleta.vlr_total), 0);
        }else{
          this.dadosTabelaCustosAtleta = response.atletas.map((atleta) => {
            return {
              ...atleta,
              vlr_lucro_total: atleta.vlr_total_lucro_pedidos - atleta.vlr_custo
            };
          }).sort((a, b) => b.vlr_lucro_total - a.vlr_lucro_total).filter((atleta) => atleta.nm_indicacao != '');
          
          this.dadosCards.vlr_total = response.atletas.reduce((acc, atleta) => acc + parseFloat(atleta.vlr_total), 0);
          this.dadosCards.vlr_total_lucro_liquido = this.dadosTabelaCustosAtleta.reduce((acc, atleta) => acc + atleta.vlr_lucro_total, 0);
        }
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar atletas');
      });
  }

  buscarAtletas(): void {
    this.clienteService.buscarDadosClientes().subscribe(
      (response) => {
        this.itensAtletas = response.clientes.filter((atleta) => {return atleta.is_atleta}).map((atleta) => {
          return {
            label: atleta.nome_completo,
            value: atleta.id
          };
        });
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar atletas');
      });
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

  resetDadosCards(): void {
    this.dadosCards = {
      qtd_total_pedido: 0,
      vlr_total_pedido: 0,
    };
  }
}
