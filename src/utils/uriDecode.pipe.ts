import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class UriDecodePipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    return decodeURIComponent(value);
  }
}
