import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { ClienteService } from '../cliente.service';

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
    private clienteService: ClienteService,
    private modalService: ModalService,
  ){
    //teste
    this.columns = [
      {
        dataField: 'telefone',
        caption: 'Telefone',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'nome_completo',
        caption: 'Nome Completo',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'cpf_cnpj',
        caption: 'CPF/CPNJ',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'email',
        caption: 'Email',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'estado',
        caption: 'Estado',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'ultima_indicacao_nome',
        caption: 'Indicado por:',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'is_atleta',
        caption: 'Atleta?',
        sorting: true,
        cellTemplate: 'boolean',
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
      tooltip: 'Editar Cliente',
      click: (rowData): void => {
        this.router.navigate(['cliente/cadastro/', rowData?.id])
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-times',
      color: 'danger',
      tooltip: 'Desativar Cliente',
      show: (rowData): boolean => {
        return rowData?.status
      },
      click: (rowData): void => {
        this.alterarStatusCliente(rowData?.id);
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-check',
      color: 'success',
      tooltip: 'Ativar Cliente',
      show: (rowData): boolean => {
        return !rowData?.status
      },
      click: (rowData): void => {
        this.alterarStatusCliente(rowData?.id);
      }
    })

    this.configuracoes.customButtons.push(
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Adicionar Cliente',
        text: 'Adicionar',
        click: (): void => {
          this.router.navigate(['cliente/cadastro']);
        }
      }
    )

    this.items = [
      { label: 'Gestão de Pedidos' }, 
      { label: 'Cliente' }, 
      { label: 'Home' }
    ];

    this.home = { icon: 'pi pi-home'};
  }
  
  ngOnInit(): void {
    this.buscarClientes()
  }

  buscarClientes(): void {
    this.clienteService.buscarDadosClientes().subscribe(
      (response) => {
        this.data = response.clientes ?? [];
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar clientes');
      }
    );
  }

  alterarStatusCliente(id: string): void {
    this.clienteService.alterarStatusCliente(id).subscribe(
      () => {
        this.toastrService.mostrarToastrSuccess(`Alterado status do cliente com sucesso`);
        this.buscarClientes();
      },
      () => {
        this.toastrService.mostrarToastrDanger('Erro ao alterar status do cliente');
      }
    );
  }

}
