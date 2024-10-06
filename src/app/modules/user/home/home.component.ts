import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { DatagridConfig, datagridConfigDefault } from 'src/app/shared/ts/dataGridConfigDefault';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  columns: any;
  configuracoes: DatagridConfig = datagridConfigDefault();
  data: any = [];

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService,
  ) {
    this.columns = [
      {
        dataField: 'id',
        caption: 'ID',
        dataType: 'int',
        width: '50px',
        sorting: true,
      },
      {
        dataField: 'nome',
        caption: 'Nome',
        dataType: 'string',
        sorting: true,
      },
      {
        dataField: 'email',
        caption: 'E-mail',
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
      tooltip: 'Editar Usuario',
      click: (rowData): void => {
        this.router.navigate(['user/cadastro/', rowData?.id])
      }
    })

    this.configuracoes.actionButtons.push({
      icon: 'pi pi-trash',
      color: 'danger',
      tooltip: 'Deletar Usuario',
      click: (rowData): void => {
        // this.modalConfirmacaoService.abrirModalConfirmacao(
        //   'Atenção',
        //   `Deseja realmente deletar essa área?`,
        //   {
        //     icone: 'pi pi-info-circle',
        //     callbackAceitar: () => {
        //       this.deletarUsuario(rowData?.id);
        //     }
        //   }
        // );
      }
    })

    this.configuracoes.customButtons.push(
      {
        icon: 'pi pi-plus',
        color: 'success',
        tooltip: 'Adicionar Usuario',
        text: 'Adicionar',
        click: (): void => {
          this.router.navigate(['user/cadastro']);
        }
      }
    )
  }

  ngOnInit(): void {
    this.buscarUsuarios();
  }

  buscarUsuarios(): void {
    this.userService.buscarDadosFilial().subscribe(
      (response) => {
        this.data = response.usuario.map((usuario) => {
          return {
            ...usuario,
            nome: `${usuario.first_name} ${usuario.last_name}`,
          };
        });
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar usuários');
      }
    );
  }
}
