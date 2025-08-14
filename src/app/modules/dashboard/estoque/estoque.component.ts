import { toLocaleFixed } from './../../../shared/ts/util';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { items } from 'src/app/shared/models/items.model';
import { ProdutoService } from '../../produto/produto.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { EstoqueService } from './estoque.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent {
  formFiltroMarca: FormGroup;
  itensMarcas: items[] = [];
  itensCategoria: items[] = [];

  dadosTabelaEstoque: any[] = [];
  columnsTabelaEstoque: any[];
  configuracoes: DatagridConfig = datagridConfigDefault();

  dadosTabelaEstoqueCoeficienteCompras: any[] = [];
  columnsTabelaEstoqueCoeficienteCompras: any[];

  dataMarcasGrafico: any = {
    labels: [],
    datasets: [
        {
            label: 'Quantidade',
            data: [],
            backgroundColor: [
              '#9B9EFF',
            ]
        },
    ],
  };

  dadosCards: any;

  basicOptionsGrafico: any;

  subs: Subscription[] = [];

  toLocaleFixed = toLocaleFixed;

  constructor(
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private toastrService: ToastrService,
    private estoqueService: EstoqueService,
  ) {
    this.columnsTabelaEstoque = [
      {
        dataField: 'nome_produto',
        caption: 'Nome',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'nome_marca',
        caption: 'Marca',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'nome_categoria',
        caption: 'Categoria',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'quantidade',
        caption: 'Qtd.',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'compra_real',
        caption: 'Preço compra unidade',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'compra_real_multiplicado',
        caption: 'Preço compra total',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'preco_venda',
        caption: 'Preço venda unidade',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
      {
        dataField: 'preco_venda_multiplicado',
        caption: 'Preço venda total',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'dinheiro',
      },
    ];

    this.columnsTabelaEstoqueCoeficienteCompras = [
      {
        dataField: 'nome_produto',
        caption: 'Nome',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'marca',
        caption: 'Marca',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'total_vendido_ultimos_3_meses',
        caption: 'Total Vendido 3 Meses',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'int',
      },
      {
        dataField: 'media_mensal',
        caption: 'Média Mensal',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'int',
      },
      {
        dataField: 'quantidade_estoque',
        caption: 'Quantidade Estoque',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'int',
      },
      {
        dataField: 'coef_estoque',  
        caption: 'Coeficiente de Compra',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'coeficiente-estoque',
      },
      {
        dataField: 'previsao_compra',
        caption: 'Próx. Pedido',
        dataType: 'string',
        sorting: true,
        cellTemplate: 'int',
      },
    ];

    this.formFiltroMarca = this.formBuilder.group({
      marca_id: [null],
      categoria_id: [null],
    });

    this.formFiltroMarca.get('marca_id').valueChanges.subscribe((value) => {
      if (value) {
        this.buscarProdutos(value, this.formFiltroMarca.get('categoria_id').value);
      }else{
        this.buscarProdutos();
      }
    });

    this.formFiltroMarca.get('categoria_id').valueChanges.subscribe((value) => {
      if (value) {
        this.buscarProdutos(this.formFiltroMarca.get('marca_id').value, value);
      }else{
        this.buscarProdutos();
      }
    });

    this.buscarProdutos()
    this.buscarMarcas();
    this.buscarCoeficienteCompras();
    this.buscarCategorias();
    this.initGrafico();
  }

  initGrafico(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-b'); 

    this.basicOptionsGrafico = {
      plugins: {
          legend: {
              display: false,
              labels: {
                  color: textColor,
              },
          },
      },
      scales: {
          x: {
              ticks: {
                  color: textColor,
              },
              grid: {
                  color: surfaceBorder,
              },
          },
          y: {
              beginAtZero: true,
              ticks: {
                  color: textColor,
              },
              grid: {
                  color: surfaceBorder,
              },
          },
      },
    };

    this.buscarDadosEstoqueMarcasGrafico();
  }

  buscarProdutos(marcaId?: string, categoriaId?: string): void {
    const data: any = {};

    if (marcaId) {
      data.marca_id = marcaId;
    }
    if (categoriaId) {
      data.categoria_id = categoriaId;
    }
    this.subs.push(
      this.estoqueService.buscarTabelaEstoque(data).subscribe(
        (response) => {
          this.dadosTabelaEstoque = response.estoque?.tabela ?? [];
          this.dadosCards = response.estoque?.cards ?? {};
        },
        (error) => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar produtos');
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

  buscarCategorias(): void {
    this.subs.push(
      this.produtoService.buscarTodasCategorias().subscribe(
        (response) => {
          this.itensCategoria = response.categorias.map((categoria) => {
            return {
              label: categoria.nome,
              value: categoria.id,
            };
          });
        },
        (error) => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar categorias');
        }
      )
    );
  }

  buscarDadosEstoqueMarcasGrafico(): void {
    this.subs.push(
      this.estoqueService.buscarDadosEstoqueMarcasGrafico().subscribe(
        (response) => {
          this.dataMarcasGrafico.labels = response.marcas.map((marca) => marca.marca);
          this.dataMarcasGrafico.datasets[0].data = response.marcas.map((marca) => marca.quantidade_total);
          this.dataMarcasGrafico = { ...this.dataMarcasGrafico };
        },
        (error) => {
          this.toastrService.mostrarToastrDanger('Erro ao buscar dados do gráfico');
        }
      )
    );
  }

  buscarCoeficienteCompras(): void {
    this.estoqueService.buscarCoeficienteCompras().subscribe(
      (response) => {
        this.dadosTabelaEstoqueCoeficienteCompras = response.lista_produtos;
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar coeficiente de compras');
      }
    );
  }
}
