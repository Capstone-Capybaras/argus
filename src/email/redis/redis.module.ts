import { Module, Logger } from '@nestjs/common';
import { RedisController } from './redis.controller';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { EmailModule } from '../email.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [EmailModule],
  providers: [
    {
      provide: 'REDIS_CLUSTER',
      useFactory: (configService: ConfigService) => {
        const redisEndpoint = configService.getOrThrow('VALKEY_ENDPOINT');
        const redisURL = redisEndpoint + ':6379';
        const endpoint =
          process.env.NODE_ENV === 'local'
            ? '127.0.0.1:6379'
            : (redisURL ?? '127.0.0.1:6379');
        const cluster = new Redis(endpoint, {
          tls: {
            rejectUnauthorized: false,
            checkServerIdentity: () => undefined,
          },
          lazyConnect: false,
          sentinelRetryStrategy: (times) => {
            Math.max(times * 100, 3000);
          },
          connectTimeout: 30000,
          enableReadyCheck: false,
          maxRetriesPerRequest: null,
        });
        cluster.on('error', (error) => {
          Logger.log('Valkey connection error: ', error);
        });
        cluster.on('connect', () => {
          Logger.log('Connected to Valkey Cluster');
        });

        cluster.on('ready', async () => {
          Logger.log('Valkey Cluster is ready');
        });

        cluster.on('close', (disconnect: any) => {
          console.log('disconnecting event', disconnect);
        });

        cluster.on('node error', (node, err) => {
          console.error(`Error on node ${node}:`, err);
        });

        cluster.on('node reconnect', (node) => {
          console.log(`Reconnected to node ${node}`);
        });
        return cluster;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLUSTER', RedisService],
  controllers: [RedisController], // Export the Redis cluster for use in other services
})
export class RedisModule {}
