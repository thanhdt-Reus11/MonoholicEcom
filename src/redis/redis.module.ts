import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from './redis.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory:async (configService:ConfigService) => ({
                store: await redisStore({
                    url: configService.get('REDIS_URI'),
                    ttl: parseInt(configService.get('CACHE_TTL')),
                }),
            }),
            isGlobal: true,
            inject: [ConfigService],
        })
    ],
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule {}
