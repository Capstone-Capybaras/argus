import { Module } from '@nestjs/common';
import { AetherService } from './aether.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

function formatPrivateKey(keyString: string) {
  // 1. Trim and remove the BEGIN/END lines, if present
  let body = keyString
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .trim();

  // 2. Remove all whitespace
  body = body.replace(/\s+/g, '');

  // 3. Chunk the base64 string into lines of 64 characters
  const chunkSize = 64;
  let formatted = '';
  for (let i = 0; i < body.length; i += chunkSize) {
    formatted += body.substring(i, i + chunkSize) + '\n';
  }

  // 4. Re-wrap in the standard PEM format
  return (
    '-----BEGIN PRIVATE KEY-----\n' + formatted + '-----END PRIVATE KEY-----\n'
  );
}

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        privateKey: Buffer.from(
          formatPrivateKey(configService.getOrThrow('AETHER_JWT_PRIVATE_KEY')),
          'utf8',
        ),
        signOptions: {
          algorithm: 'RS256',
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.getOrThrow('AETHER_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AetherService],
  exports: [AetherService],
})
export class AetherModule {}
