import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { Observable, of, tap } from "rxjs";

@Injectable()
export class CacheRedisInterceptor implements NestInterceptor {
    constructor(
        private readonly redisService: RedisService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler) : Promise<Observable<any>> {
        const requestMethod = context.switchToHttp().getRequest().method;

        const cacheKey = this.generateCacheKey(context);
        const cacheResponse = await this.redisService.get(cacheKey);

        if(requestMethod === 'GET') {
            if (cacheResponse) {
                return of(cacheResponse);
            }
            return next.handle().pipe(
                tap((response) => {
                    this.redisService.set(cacheKey, response);
                })
            )
        }
        else {
            return next.handle().pipe(
                tap(() => {
                    if(cacheResponse) {
                        this.redisService.del(cacheKey);
                    }
                    if (requestMethod === 'PATCH' || requestMethod === 'DELETE') {
                        const sliceCacheKey = cacheKey.split('/');
                        this.redisService.del(sliceCacheKey.splice(0,2).join('/'));
                    }
                })
            )
        }
    }


    private generateCacheKey(context: ExecutionContext) : string {
        const request = context.switchToHttp().getRequest();
        const url = request.url;
        const cacheKey = `cache:${url}`;

        return cacheKey;
    }
}