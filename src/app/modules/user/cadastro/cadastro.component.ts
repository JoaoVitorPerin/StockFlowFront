import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/shared/components/toastr/toastr.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  formUser: FormGroup;
  idUsuario: string;

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private router: Router,
              private userService: UserService,
              private activatedRoute: ActivatedRoute){
                this.formUser = this.formBuilder.group({
                  user_id: [null],
                  username: [null, Validators.required],
                  first_name: [null, Validators.required],
                  last_name: [null, Validators.required],
                  email: [null, [Validators.required, Validators.email]],
                })

                this.idUsuario = this.activatedRoute.snapshot.paramMap.get('id');
                this.formUser.patchValue({user_id: this.idUsuario});

                if (this.idUsuario) {
                  this.formUser.get('user_id').disable();
                  this.buscarUserById(this.idUsuario);
                }
              }

  buscarUserById(id: string): void {
    this.userService.buscarUserById(id).subscribe({
      next: (dados) => {
        this.formUser.patchValue(dados.usuario);
      }, error: () => {
        this.toastrService.mostrarToastrDanger('Erro ao buscar usuário');
      }
    })
  }

  cadastrarUser(): void {
    this.formUser.markAllAsTouched();

    if(this.formUser.valid){
      this.userService.cadastrarUser(this.formUser.getRawValue()).subscribe({
        next: (response) => {
          this.toastrService.mostrarToastrSuccess('Usuário cadastrado com sucesso');
          this.router.navigate(['user/cadastro', response.user_id]);
        }, error: () => {
          this.toastrService.mostrarToastrDanger('Erro ao cadastrar usuário');
        }
      })
    }
  }
}
