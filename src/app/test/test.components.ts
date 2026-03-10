import { Component, ElementRef, HostListener, signal, ViewChild, viewChild } from '@angular/core';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.components.html',
  styleUrl: './test.components.css',
})
export class TestComponents {
  @ViewChild('userMenuParent') userMenuParentRef!: ElementRef;
  open = signal(false);
  openUserMenu = signal(false);
  toggleSidebar() {
    this.open.update((p) => !p);
  }
  closeSidebar() {
    this.open.set(false);
  }
  toggleOpenUserMenu() {
    this.openUserMenu.update((p) => !p);
  }
  closeOpenUserMenu() {
    this.openUserMenu.set(false);
  }

  @HostListener('document:click', ['$event'])
  closeSetting(e: Event) {
    
    const clickedInside = this.userMenuParentRef?.nativeElement.contains(e.target);
   

    if (!clickedInside) {
      this.closeOpenUserMenu();
    } 
  }
}
