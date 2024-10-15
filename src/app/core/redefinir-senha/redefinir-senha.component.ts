import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { AutenticacaoService } from '../autenticacao/autenticacao.service';
import { CommonModule } from '@angular/common';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
import { RedefinirSenhaService } from './redefinir-senha.service';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
  ],
  templateUrl: './redefinir-senha.component.html',
  styleUrl: './redefinir-senha.component.scss'
})
export class RedefinirSenhaComponent {
  formRedefinirSenha: FormGroup;
  formRedefinirSenhaCodigo: FormGroup;
  loadingRequest = signal(false);
  isNextStep = false;

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private tokenService: TokenService,
              private router: Router,
              private redefinirSenhaService: RedefinirSenhaService,
              private autenticacaoService: AutenticacaoService){}

  ngOnInit(): void {
    this.tokenService.clearToken()

    this.formRedefinirSenha = this.formBuilder.group({
      email: [null, Validators.required],
    })

    this.formRedefinirSenhaCodigo = this.formBuilder.group({
      codigo: [null, Validators.required],
      password: [null, Validators.required],
      confirm_password: [null, Validators.required],
    })
  }

  enviarEmail(): void {
    if(this.loadingRequest())
      return

    this.formRedefinirSenha.markAllAsTouched()

    if(this.formRedefinirSenha.valid){
      this.loadingRequest.set(true);
      this.redefinirSenhaService.enviarEmail(this.formRedefinirSenha.getRawValue()).subscribe(
        (response) => {
          if(response.status){
            this.loadingRequest.set(false);
            this.toastrService.mostrarToastrSuccess('Email enviado com sucesso!')
            this.isNextStep = true;
          }else{
            this.loadingRequest.set(false);
            this.toastrService.mostrarToastrDanger(response.mensagem ?? 'Erro ao enviar email!')
          }
        },
        (error) => {
          this.loadingRequest.set(false);
          this.toastrService.mostrarToastrDanger('Erro ao enviar email!')
        }
      )
    } else {
      this.loadingRequest.set(false);
      this.toastrService.mostrarToastrDanger('Informe um email válido!')
    }
  }

  redefinirSenha(): void {
    if(this.loadingRequest())
      return

    this.formRedefinirSenhaCodigo.markAllAsTouched()

    if(this.formRedefinirSenhaCodigo.valid){
      this.loadingRequest.set(true);
      console.log(this.formRedefinirSenhaCodigo.getRawValue())
      this.loadingRequest.set(false);
      this.redirectLogin()
    }else {
      this.loadingRequest.set(false);
      this.toastrService.mostrarToastrDanger('Informe os dados corretos!')
    }
  }

  redirectLogin(): void {
    this.router.navigate(['login'])
  }
}
