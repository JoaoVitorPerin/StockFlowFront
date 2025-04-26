import { Component, HostListener, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { AutenticacaoService } from '../autenticacao/autenticacao.service';
import { CommonModule } from '@angular/common';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ButtonModule } from 'primeng/button';
import { RedefinirSenhaService } from './redefinir-senha.service';
import { confirmPasswordValidator, validatorSenhaForte } from 'src/app/shared/validator/validatorForm';
import { Subscription } from 'rxjs';

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

  subs: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private tokenService: TokenService,
              private router: Router,
              private redefinirSenhaService: RedefinirSenhaService){}

  ngOnInit(): void {
    this.tokenService.clearToken()

    this.formRedefinirSenha = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    })

    this.formRedefinirSenhaCodigo = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      codigo: [null, Validators.required],
      password: [null, [Validators.required, validatorSenhaForte()]],
      confirmPassword: [null, [Validators.required, validatorSenhaForte()]],
    },{ validators: confirmPasswordValidator })
  } 

  enviarEmail(): void {
    if(this.loadingRequest())
      return

    this.formRedefinirSenha.markAllAsTouched()

    if(this.formRedefinirSenha.valid){
      this.loadingRequest.set(true);
      this.subs.push(
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
      );
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
      this.subs.push(
        this.redefinirSenhaService.redefinirSenha(this.formRedefinirSenhaCodigo.getRawValue()).subscribe(
          (response) => {
            if(response.status){
              this.loadingRequest.set(false);
              this.toastrService.mostrarToastrSuccess('Senha redefinida com sucesso!')
              this.router.navigate(['login'])
            }else{
              this.loadingRequest.set(false);
              this.toastrService.mostrarToastrDanger(response.mensagem ?? 'Erro ao redefinir senha!')
            }
          },
          (error) => {
            this.loadingRequest.set(false);
            this.toastrService.mostrarToastrDanger('Erro ao redefinir senha!')
          }
        )
      );
    } else {
      this.loadingRequest.set(false);
      this.toastrService.mostrarToastrDanger('Infome todos os dados para prosseguir!')
    }
  }

  redirectLogin(): void {
    this.router.navigate(['login'])
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterPress(event: KeyboardEvent) {
    if(!this.isNextStep){
      this.enviarEmail();
    }else{
      this.redefinirSenha();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}
