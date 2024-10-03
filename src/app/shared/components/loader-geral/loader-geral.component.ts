import { LoadingService } from './loader-geral.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-geral',
  templateUrl: './loader-geral.component.html',
  styleUrls: ['./loader-geral.component.css']
})
export class LoaderGeralComponent implements OnInit {

  loading: boolean = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.listenToLoading();
  }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

}
