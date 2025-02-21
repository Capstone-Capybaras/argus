import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServerSelectorService } from './server-selector.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('server-selector')
export class ServerSelectorController {
  constructor(private readonly selectorService: ServerSelectorService) {}

  @Get()
  async getSelectedServer() {
    return { selectedServer: await this.selectorService.getSelectedServer() };
  }

  @Post('switch')
  async switchServer(@Body() body: { server: 'simx1' | 'simx2' }) {
    await this.selectorService.updateSelectedServer(body.server);
    await this.selectorService.reloadEmailConfig();
    return { message: `Switched to ${body.server} server.` };
  }
}
