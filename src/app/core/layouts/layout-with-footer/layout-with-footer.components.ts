import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { FooterComponents } from '../components/footer/footer.components';

@Component({
  selector: 'app-layout-with-footer',
  imports: [RouterOutlet , FooterComponents],
  templateUrl: './layout-with-footer.components.html',
  styleUrl: './layout-with-footer.components.css',
})
export class LayoutWithFooterComponents {

}
