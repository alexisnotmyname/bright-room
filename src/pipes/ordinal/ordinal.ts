import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the OrdinalPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'ordinal',
})
export class OrdinalPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(int) {
    const ones = +int % 10, tens = +int % 100 - ones;
    return int + ["th","st","nd","rd"][ tens === 10 || ones > 3 ? 0 : ones ];
  }
}
