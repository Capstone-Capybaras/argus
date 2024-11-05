import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './connection';
// import {ProjectService} from '../modules/project/project.service'
import * as schemas from './schema';
// import { AuthModule } from 'src/auth/auth.module';
// import { EntityModule } from 'src/modules/entity/entity.module';
// import { ScenarioModule } from 'src/modules/scenario/scenario.module';

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
          schema: { ...schemas },
        });
      },
      inject: [ConfigService],
    },
    // ProjectService,
    // AuthModule,
    // EntityModule,
    // ScenarioModule
  ],
  // exports: [ProjectService, DATABASE_CONNECTION, AuthModule, EntityModule, ScenarioModule],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
