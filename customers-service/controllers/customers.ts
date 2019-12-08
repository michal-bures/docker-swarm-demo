import {Body, Controller, Get, Put, Route} from 'tsoa';

import * as Redis from 'ioredis';
import * as Uuid from 'uuid';

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
});
redisClient.on('error', (err: any) => console.log("REDIS ERROR", err))

export interface Customer {
    id: string;
    name: string;
    address: string;
}

export interface CustomerCreationRequest {
    name: string;
    address: string;
}

@Route('Customers')
export class Customers extends Controller {

    @Get()
    public async getAllCustomers(): Promise<Array<Customer>> {
        const customerIds = await redisClient.lrange('customers', 0, -1);
        return Promise.all(customerIds.map((id) => this.getCustomer(id)))
    }

    @Get('{id}')
    public async getCustomer(id: string): Promise<Customer> {
        const key = `customer:${id}`;
        if (!await redisClient.exists(key)) {
            throw {
                status: 404,
                error: 'no such customer',
                customerId: id
            };
        }

        const result: Customer = {
            id: await redisClient.hget(key, 'id') || '',
            name: await redisClient.hget(key, 'name') || '',
            address: await redisClient.hget(key, 'address') || '',
        };

        return result;
    }

    @Put()
    public async createCustomer(@Body() customer: CustomerCreationRequest): Promise<string> {
        const id = Uuid.v4();
        await redisClient.hmset(`customer:${id}`, {id, ...customer});
        await redisClient.lpush('customers', id);
        this.setStatus(200);
        return `${id}`;
    }
}
