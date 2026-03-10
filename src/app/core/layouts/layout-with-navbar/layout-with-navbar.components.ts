import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavbarComponents } from "../components/navbar/navbar.components";

@Component({
  selector: 'app-layout-with-navbar',
  imports: [RouterOutlet, NavbarComponents],
  templateUrl: './layout-with-navbar.components.html',
  styleUrl: './layout-with-navbar.components.css',
})
export class LayoutWithNavbarComponents {

}
