import { CardModule } from 'primeng/card';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toLocaleFixed } from '../../ts/util';

@Component({
  selector: 'app-card-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule
  ],
  templateUrl: './card-dashboard.component.html',
  styleUrl: './card-dashboard.component.scss'
})
export class CardDashboardComponent {
  @Input() title: string;
  @Input() valor: number;
  @Input() tipoValor: string;
  @Input() cor: string;

  toLocaleFixed = toLocaleFixed;
  parseFloat = parseFloat;

  formatarValor() {
    if(!this.valor) return '--';

    if(this.tipoValor === 'porcentagem') {
      return `${toLocaleFixed(this.valor, 2)}%`;
    }else if(this.tipoValor === 'moeda') {
      return `R$ ${toLocaleFixed(this.valor, 2)}`;
    }else {
      return this.valor;
    }
  }
}
