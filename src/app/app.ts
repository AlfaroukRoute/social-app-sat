import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponents } from "./core/layouts/components/navbar/navbar.components";
import { FooterComponents } from "./core/layouts/components/footer/footer.components";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxTranslateService } from './core/auth/services/ngx-translate.service';
import { TestComponents } from "./test/test.components";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponents, NgxSpinnerModule, TestComponents],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  ngxTranslateService = inject(NgxTranslateService)
  protected readonly title = signal('social-app');

  // !!APP 
  constructor(){
    this.ngxTranslateService.initNgxTranslate();
  }
}
