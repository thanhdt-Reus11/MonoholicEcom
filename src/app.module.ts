import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigMongoDB } from './config-app';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessGuard } from './auth/guards/access-token.guard';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { BillModule } from './bill/bill.module';
import { BillDetailModule } from './bill-detail/bill-detail.module';
import { PaypalModule } from './paypal/paypal.module';
import { AbilityModule } from './ability/ability.module';
import { AbilityGuard } from './ability/ability.guard';
import { RedisModule } from './redis/redis.module';
import { CacheRedisInterceptor } from './redis/cache.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { MessageGetway } from './websocket/message.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigMongoDB,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    BillModule,
    BillDetailModule,
    PaypalModule,
    AbilityModule,
    RedisModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard
    },
    {
      provide: APP_GUARD,
      useClass: AbilityGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheRedisInterceptor
    },
    MessageGetway,
  ],
})
export class AppModule {}
