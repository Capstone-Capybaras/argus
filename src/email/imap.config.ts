import { ImapSimpleOptions } from 'imap-simple';
import { ConfigService } from '@nestjs/config';
export async function getImapConfig(
  configService: ConfigService,
): Promise<ImapSimpleOptions> {
  return {
    imap: {
      user: String(process.env.EMAIL_USERNAME),
      password: String(process.env.EMAIL_PASSWORD),
      host: process.env.IMAP_HOST,
      port: 933,
      tls: true,
      authTimeout: 3000,
    },
  };
}
