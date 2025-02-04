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
        cpf_cnpj: [null],
        telefone: [null, Validators.required],
        email: [null, [Validators.email]],
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

      this.home = { icon: 'pi pi-home'};

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
      const data = {
        ...this.formCliente.getRawValue(),
        cpf_cnpj: this.formCliente.get('cpf_cnpj').value === "" ? null : this.formCliente.get('cpf_cnpj').value,
      }
      this.clienteService.cadastrarCliente(data).subscribe({
        next: (response) => {
          if(response.status){
            this.toastrService.mostrarToastrSuccess(`Cliente ${this.idCliente ? 'editado' : 'cadastrado'} com sucesso`);
            this.router.navigate(['cliente/home']);
          }else{
            this.toastrService.mostrarToastrDanger(response.descricao ?? 'Erro ao cadastrar cliente')
          }
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

  resetCampoCpfInvalido(): void {
    if (!this.validarCPF() && this.formCliente.get('cpf_cnpj').value.length >= 11) {
      this.toastrService.mostrarToastrDanger('CPF inválido!');
      this.formCliente.patchValue({cpf_cnpj: null});
    }
  }   

  validarCPF() {
    const cpfusuario = this.formCliente.get('cpf_cnpj').value ?? null;
    if(!cpfusuario) return false;

    let cpf = cpfusuario?.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // Verifica se tem 11 dígitos e se não é uma sequência repetida (ex: 111.111.111-11)
    }

    let soma = 0, resto;

    // Calcula o primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true
  }
}
