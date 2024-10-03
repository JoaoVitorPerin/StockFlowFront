import { Component } from '@angular/core';
import { FormModule } from 'src/app/shared/components/form/form.module';

@Component({
  selector: 'app-autenticacao',
  standalone: true,
  imports: [FormModule],
  templateUrl: './autenticacao.component.html',
  styleUrl: './autenticacao.component.scss'
})
export class AutenticacaoComponent {

}
