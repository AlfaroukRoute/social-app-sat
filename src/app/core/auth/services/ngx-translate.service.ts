import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Langs = 'ar' | 'en' ;
@Injectable({
  providedIn: 'root',
})
export class NgxTranslateService {
  private translate = inject(TranslateService);
  // !!
  initNgxTranslate() {
    this.translate.addLangs(['ar', 'en']);
    this.translate.setFallbackLang('en');
    // !!! after toggler ||| get localStorage
    const lang = localStorage.getItem('user-lang') || 'en' ;
    this.translate.use(lang);
    this.changeDirection(lang as Langs);
    
  }

  // ! switch direction , ..........
  useLanguage(lang : Langs) {
    this.translate.use(lang);
    localStorage.setItem('user-lang' , lang)
    this.changeDirection(lang)
  }


  changeDirection(lang : Langs) {
    const htmlTag = document.querySelector('html') ;
    htmlTag?.setAttribute('dir' , lang == 'ar' ? 'rtl' : 'ltr')
    htmlTag?.setAttribute('lang' , lang)
  }

}
