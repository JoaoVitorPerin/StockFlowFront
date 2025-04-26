import { VendasMarcasService } from './vendas-marcas.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { toLocaleFixed } from 'src/app/shared/ts/util';
import { ProdutoService } from '../../produto/produto.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendas-marcas',
  templateUrl: './vendas-marcas.component.html',
  styleUrls: ['./vendas-marcas.component.css'],
})
export class VendasMarcasComponent{
  formFiltroDados: FormGroup;
  itensAnomes: items[] = [];
  itensMarcas: items[] = [];

  dadosTabelaVendas: any[] = [];
  columnsTabelaVendas: any[];
  configuracoes: DatagridConfig = datagridConfigDefault();
  configuracoesVendas: DatagridConfig = datagridConfigDefault();

  dadosCards: any = {
    vlr_venda: 0,
    vlr_custo: 0,
    qtd_total: 0,
    vlr_margem: 0,
  };
  
  subs: Subscription[] = [];

  toLocaleFixed = toLocaleFixed;
  parseFloat = parseFloat;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private produtoService: ProdutoService,
    private vendasMarcasService: VendasMarcasService
  ) {
    this.formFiltroDados = this.formBuilder.group({
      anomes: [null],
      marca_id: [null],
    });

    this.itensAnomes = this.getUltimos12Meses();

    this.buscarMarcas();

    this.columnsTabelaVendas = [
      {
        dataField: 'nome_produto',
        caption: 'Produto',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'qtd_produto',
        caption: 'Qtd.',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'vlr_venda_total',
        caption: 'Valor venda',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
      {
        dataField: 'vlr_custo_total',
        caption: 'Valor Custo',
        dataType: 'string',
        cellTemplate: 'dinheiro',
        sorting: true,
      },
    ];

    this.formFiltroDados.get('anomes').setValue(this.itensAnomes[0].value, {emitEvent: false});
    this.formFiltroDados.get('marca_id').setValue(16, {emitEvent: false});

    this.formFiltroDados.get('anomes').valueChanges.subscribe((value) => {
      this.dadosTabelaVendas = [];

      this.resetDadosCards();

      if (value) {
        this.buscarDadosVendasMarcas(value, this.formFiltroDados.get('marca_id').value ?? '');
      }
    });

    this.formFiltroDados.get('marca_id').valueChanges.subscribe((value) => {
      this.dadosTabelaVendas = [];

      this.resetDadosCards();
      
      if (value) {
        this.buscarDadosVendasMarcas(this.formFiltroDados.get('anomes').value, value);
      }else{
        this.buscarDadosVendasMarcas(this.formFiltroDados.get('anomes').value);
      }
    });

    this.buscarDadosVendasMarcas(this.formFiltroDados.get('anomes').value, this.formFiltroDados.get('marca_id').value);
  }

  buscarDadosVendasMarcas(anomes: string, marca_id?: string): void {
    const data: any = {};
    data.anomes = anomes;

    if (marca_id) {
      data.marca_id = marca_id;
    }

    this.subs.push(
      this.vendasMarcasService.buscarDadosVendasMarcas(data).subscribe(
        (response) => {
          this.dadosTabelaVendas = response.dados_vendas_marcas?.lista_produtos ?? [];
          this.dadosCards.vlr_venda = response.dados_vendas_marcas?.resumo_valores?.vlr_venda_somado ?? 0;
          this.dadosCards.vlr_custo = response.dados_vendas_marcas?.resumo_valores?.vlr_custo_somado ?? 0;
          this.dadosCards.qtd_total = response.dados_vendas_marcas?.resumo_valores?.qtd_somada ?? 0;
          this.dadosCards.vlr_margem = response.dados_vendas_marcas?.resumo_valores?.margem_percentual ?? 0;
        },
        (error) => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar atletas');
        }
      )
    );
  }

  buscarMarcas(): void {
    this.subs.push(
      this.produtoService.buscarTodasMarcas().subscribe(
        (response) => {
          this.itensMarcas = response.marcas.map((marca) => {
            return {
              label: marca.nome,
              value: marca.id,
            };
          });
        },
        (error) => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar marcas');
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

  resetDadosCards(): void {
    this.dadosCards = {
      qtd_total_pedido: 0,
      vlr_total_pedido: 0,
    };
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
