import { ImapSimpleOptions } from 'imap-simple';
import { ConfigService } from '@nestjs/config';

// TODO: might pull env vars from secrets, so prepare this method to use with config service
export async function getImapConfig(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
