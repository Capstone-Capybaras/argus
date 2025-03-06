import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class UriDecodePipe implements PipeTransform<string, string> {
  transform(value: string) {
    return decodeURIComponent(value);
  }
}
