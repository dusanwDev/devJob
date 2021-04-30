import { Pipe, PipeTransform } from '@angular/core';
import { Company } from 'src/app/models/company.model';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: Company[], input: string): string[] {
    let reg = new RegExp(`^${input}`, 'gi');
    let filtered = [];
    for (const item of value) {
      if (item.companyName === input) {
        filtered.push(item);
      }
    }
    return filtered;
  }
}
