import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { ClienteService } from '../cliente.service';
import { ViaCepService } from 'src/app/shared/services/viaCep.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  formCliente: FormGroup;
  idCliente: string;
  items: any[];
  clienteAtletas: any[] = [];
  home: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private clienteService: ClienteService,
    private viaCepService: ViaCepService,
    private activatedRoute: ActivatedRoute)
    {
      this.formCliente = this.formBuilder.group({
        cliente_id: [null],
        nome_completo: [null, Validators.required],
        cpf_cnpj: [null, Validators.required],
        telefone: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        logradouro: [null],
        numero: [null, Validators.required],
        complemento: [null],
        bairro: [null],
        localidade: [null],
        uf: [null],
        cep: [null, Validators.required],
        cliente_indicador: [null],
        is_atleta: [null]
      })

      this.formCliente.get('cep')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => value && value.length === 8)
      )
      .subscribe(cep => {
        console.log(cep)
        this.viaCepService.buscarCep(cep).subscribe(
          data => {
            this.formCliente.patchValue(data)
          },
          error => {
            console.error('Erro ao buscar o CEP:', error);
          }
        );
      });

      this.idCliente = this.activatedRoute.snapshot.paramMap.get('id');
      this.formCliente.patchValue({cliente_id: this.idCliente});

      if (this.idCliente) {
        this.formCliente.get('cliente_id').disable();
        this.buscarClienteById(this.idCliente);
      }

      this.items = [
        { label: 'Pedido' }, 
        { label: 'Cliente' }, 
        { label: 'Cadastro' }
      ];

      this.home = { icon: 'pi pi-home', routerLink: '/' };

      this.buscarClientes()
    }

  buscarClienteById(id: string): void {
    this.clienteService.buscarClienteById(id).subscribe({
      next: (dados) => {
        this.formCliente.patchValue(dados.clientes);
        this.formCliente.patchValue({
          logradouro: dados.clientes.rua,
          uf: dados.clientes.estado,
          localidade: dados.clientes.cidade,
        })
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar cliente');
      }
    })
  }

  buscarClientes(): void {
    this.clienteService.buscarDadosClientes().subscribe(
      (response) => {
        this.clienteAtletas = response.clientes
        .filter(cliente => cliente.status && cliente.is_atleta && (cliente.id != this.idCliente))
        .map((cliente) => {
          return {label: cliente.nome_completo, value: cliente.id};
        });
      },
      (error) => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar clientes');
      }
    );
  }

  cadastrarCliente(): void {
    this.formCliente.markAllAsTouched();
    if(this.formCliente.valid){
      this.clienteService.cadastrarCliente(this.formCliente.getRawValue()).subscribe({
        next: (response) => {
          this.toastrService.mostrarToastrSuccess('Cliente cadastrado com sucesso');
          this.router.navigate(['cliente/cadastro', response.cliente_id]);
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Erro ao cadastrar cliente');
        }
      })
    }
  }

  onCepChange(): void {
    const cepValue = this.formCliente.get('cep')?.value;
    const cepOnlyNumbers = cepValue?.replace(/\D/g, '');
    if (cepOnlyNumbers && cepOnlyNumbers.length === 8) {
      this.viaCepService.buscarCep(cepOnlyNumbers).subscribe(
        data => {
          console.log(data)
          if(data.erro){
            this.formCliente.patchValue({
              logradouro: null,
              numero: null,
              complemento: null,
              bairro: null,
              localidade: null,
              uf: null,
            })
            this.toastrService.mostrarToastrDanger('Digite um CEP válido!')
          }else{
            this.formCliente.patchValue(data)
          }
        },
        error => {
          console.error('Erro ao buscar o CEP:', error);
        }
      );
    } else {
      this.toastrService.mostrarToastrDanger('Digite um CEP válido!')
    }
  }
  
}
