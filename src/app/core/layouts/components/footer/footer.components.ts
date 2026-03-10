import { Component, inject } from '@angular/core';
import { FlowbiteService } from '../../../services/flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.components.html',
  styleUrl: './footer.components.css',
})
export class FooterComponents {

  flowbiteService = inject(FlowbiteService);
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
