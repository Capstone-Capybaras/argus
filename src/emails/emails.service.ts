import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailsService {
  processInbound() {
    return true;
  }
}
