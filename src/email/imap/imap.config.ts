import { ImapSimpleOptions } from 'imap-simple';

export async function getImapConfig(): Promise<ImapSimpleOptions> {
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
