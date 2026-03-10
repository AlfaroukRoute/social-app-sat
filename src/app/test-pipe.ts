import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hamada'
})
export class TestPipe implements PipeTransform {

  // : :  :  :: 
  transform(value: string[] , term : string = "dd "): string[] {
    return value.filter(i => i.includes(term));
  }

}


// pipe translate 