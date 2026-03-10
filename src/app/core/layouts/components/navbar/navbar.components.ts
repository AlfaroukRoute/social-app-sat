import { Component, inject, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.components.html',
  styleUrl: './navbar.components.css',
})
export class NavbarComponents  {
  flowbiteService = inject(FlowbiteService);
  authS = inject(AuthService)
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite(); 
    });
  }


  logOut(){
    this.authS.logOut()

  }

}
