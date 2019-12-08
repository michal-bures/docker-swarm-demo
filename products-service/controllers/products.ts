import {Body, Controller, Get, Put, Route} from 'tsoa';

import * as Redis from 'ioredis';
import * as Uuid from 'uuid';

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
});
redisClient.on('error', (err: any) => console.log("REDIS ERROR", err))

export interface Product {
    id: string;
    name: string;
}

export interface ProductCreationRequest {
    name: string;
}

@Route('Products')
export class Products extends Controller {

    constructor() {
        super();
    }

    @Get()
    public async getAllProducts(): Promise<Array<Product>> {
        const customerIds = await redisClient.lrange('products', 0, -1);
        return Promise.all(customerIds.map((id) => this.getProduct(id)))
    }

    @Get('{id}')
    public async getProduct(id: string): Promise<Product> {
        const key = `product:${id}`;
        if (!await redisClient.exists(key)) {
            throw {
                status: 404,
                error: 'no such customer',
                customerId: id
            };
        }

        const result: Product = {
            id: await redisClient.hget(key, 'id') || '',
            name: await redisClient.hget(key, 'name') || '',
        };

        return result;
    }

    @Put()
    public async createProduct(@Body() product: ProductCreationRequest): Promise<string> {
        const id = Uuid.v4();
        await redisClient.hmset(`product:${id}`, {id, ...product});
        await redisClient.lpush('products', id);
        this.setStatus(200);
        return `${id}`;
    }

    public async reset() {
        await redisClient.flushall();
        await this.createProduct({name: 'Apples'});
        await this.createProduct({name: 'Oranges'});
        await this.createProduct({name: 'Bananas'});
        await this.createProduct({name: 'Melons'});
        await this.createProduct({name: 'Lemons'});
        await this.createProduct({name: 'Carrots'});
    }
}
