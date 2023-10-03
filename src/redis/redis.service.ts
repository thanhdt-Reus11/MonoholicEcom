import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache : Cache,
    ) {}

    async get(key:string) {
        console.log(`GET ${key} FROM REDIS`);
        const data = await this.cache.get(key);
        return data;
    }

    async set(key: string, value: unknown) {
        console.log(`SET ${key} FROM REDIS`);
        await this.cache.set(key, value);
    }

    async del(key:string) {
        console.log(`DELETE ${key} FROM REDIS`);
        await this.cache.del(key);
    }

    async reset() {
        await this.cache.reset();
    }
}
