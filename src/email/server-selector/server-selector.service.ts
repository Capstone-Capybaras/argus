import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { serverTable } from '../../database/schema';
import { ConfigService } from '@nestjs/config';
//import { EmailService } from '../email.service';

@Injectable()
export class ServerSelectorService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly configService: ConfigService,
  ) {}

  async createSelectedServer(server: 'simx1' | 'simx2') {
    const result = await this.db
      .insert(serverTable)
      .values({ server: server })
      .returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  async updateSelectedServer(newServer: 'simx1' | 'simx2') {
    const result = await this.db
      .update(serverTable)
      .set({ server: newServer })
      .returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  async getSelectedServer() {
    const server = await this.db.select().from(serverTable);
    return server[0].server;
  }

  private emailTransportConfig = this.getEmailConfig();

  async getEmailConfig() {
    //const selectedServer = await this.getSelectedServer() || 'simx1';
    const selectedServer = 'simx1';
    const servers = {
      simx1: {
        host: this.configService.getOrThrow('EMAIL_HOST'),
        port: 465, //587 not secure
        secure: true,
        auth: {
          user: this.configService.getOrThrow('EMAIL_USERNAME'),
          pass: this.configService.getOrThrow('EMAIL_PASSWORD'),
        },
      },
      simx2: {
        host: this.configService.getOrThrow('EMAIL_HOST'),
        port: 465, //587 not secure
        secure: true,
        auth: {
          user: this.configService.getOrThrow('EMAIL_BACKUP_USERNAME'),
          pass: this.configService.getOrThrow('EMAIL_BACKUP_PASSWORD'),
        },
      },
    };
    return servers[selectedServer];
  }

  async reloadEmailConfig() {
    this.emailTransportConfig = this.getEmailConfig();
    console.log('Email configuration reloaded:', this.emailTransportConfig);
  }
}
