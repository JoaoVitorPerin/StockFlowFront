import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { items } from 'src/app/shared/models/items.model';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { formatarData } from 'src/app/shared/ts/util';
import { ProdutoService } from '../../produto/produto.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { ModalService } from 'src/app/shared/components/modal/modal.service';

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
  ) {
    this.columns = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'nome',
        caption: 'Nome',
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
      tooltip: 'Editar Marca',
      click: (rowData): void => {
        this.router.navigate(['marca/cadastro/', rowData?.id])
      }
    })

    this.configuracoes.customButtons.push(
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Adicionar Marca',
        text: 'Adicionar Marca',
        click: (): void => {
          this.router.navigate(['marca/cadastro']);
        }
      }
    )

    this.items = [
      { label: 'Gestão Admin' }, 
      { label: 'Marca' }, 
      { label: 'Home' }
    ];

    this.home = { icon: 'pi pi-home'};
  }

  ngOnInit(): void {
    this.buscarMarcas();
  }

  buscarMarcas(): void {
    this.produtoService.buscarTodasMarcas().subscribe(
      (response) => {
        this.data = response.marcas ?? [];
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar marcas');
      }
    );
  }
}
