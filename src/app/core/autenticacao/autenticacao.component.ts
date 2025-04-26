import { Component, HostListener, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormModule } from 'src/app/shared/components/form/form.module';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { AutenticacaoService } from './autenticacao.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-autenticacao',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule
  ],
  templateUrl: './autenticacao.component.html',
  styleUrl: './autenticacao.component.scss'
})
export class AutenticacaoComponent implements OnInit {
  formLogin: FormGroup;
  loadingRequest = signal(false);

  subs: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private tokenService: TokenService,
              private router: Router,
              private autenticacaoService: AutenticacaoService){}

  ngOnInit(): void {
    this.tokenService.clearToken()

    this.formLogin = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  login(): void {
    if(this.loadingRequest())
      return

    this.formLogin.markAllAsTouched()

    if(this.formLogin.valid){
      this.loadingRequest.set(true);
      this.subs.push(
        this.autenticacaoService.login(this.formLogin.getRawValue()).subscribe({
          next: (dados) => {
            if(dados.access){
              this.tokenService.setToken(dados);
              this.router.navigate(['separar-pedido'])
              this.loadingRequest.set(false);
            }
          }, error: () => {
            this.loadingRequest.set(false);
          }
        })
      );
    } else {
      this.loadingRequest.set(false);
      this.toastrService.mostrarToastrDanger('Informe o login e senha para prosseguir')
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterPress(event: KeyboardEvent) {
    this.login();
  }

  redirectRedefinirSenha(): void {
    this.router.navigate(['redefinir-senha'])
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}
