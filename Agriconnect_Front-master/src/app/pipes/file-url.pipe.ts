import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileUrl'
})
export class FileUrlPipe implements PipeTransform {
  transform(file: File | null): string {
    if (!file) return '';
    return URL.createObjectURL(file); // Génère une URL pour un objet File
  }
}
