import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './connection';
import * as schemas from './schema';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });
        // validate db connection
        try {
          const client = await pool.connect();
          client.release();
        } catch (err) {
          throw new Error(String(err));
        }
        Logger.log('Database connected');

        return drizzle(pool, {
          casing: 'snake_case',
          schema: {
            ...schemas,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
