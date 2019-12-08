import {Body, Controller, Get, Put, Query, Route} from 'tsoa';

import * as Redis from 'ioredis';
import * as Uuid from 'uuid';
import * as superagent from 'superagent';

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
});
redisClient.on('error', (err: any) => console.log("REDIS ERROR", err))

export interface Invoice {
    id: string;
    productId: string;
    customerId: string;
    quantity: number;
    issuedAt: string;
}

export interface InvoiceCreationRequest {
    customerId: string;
    productId: string;
    quantity: number;
}

@Route('Invoices')
export class Invoices extends Controller {

    @Get()
    public async getInvoices(@Query('customer-id') customerId?: string): Promise<Array<Invoice>> {
        const invoiceIds = await redisClient.lrange('invoices', 0, -1);
        const all = await Promise.all(invoiceIds.map((id) => this.getInvoice(id)));
        if (customerId) {
            return all.filter(invoice => invoice.customerId === customerId);
        } else {
            return all;
        }
    }

    @Get('{id}')
    public async getInvoice(id: string): Promise<Invoice> {
        const key = `invoice:${id}`;
        if (!await redisClient.exists(key)) {
            throw {
                status: 404,
                error: 'no such invoice',
                id: id
            };
        }

        const result: Invoice = {
            id: await getFromRedis('id'),
            productId: await getFromRedis('productId'),
            customerId: await getFromRedis('customerId'),
            quantity: parseInt(await getFromRedis('quantity')),
            issuedAt: await getFromRedis('issuedAt'),
        };
        return result;


        async function getFromRedis(field: string): Promise<any> {
            return (await redisClient.hget(key, field)) || '';
        }

    }

    @Put()
    public async createInvoice(@Body() invoice: InvoiceCreationRequest): Promise<string> {
        await Promise.all([
            assertCustomerIdValid(invoice.customerId),
            assertProductIdValid(invoice.productId)
        ]);

        const id = Uuid.v4();
        const issuedAt = new Date().toISOString();
        await redisClient.hmset(`invoice:${id}`, {id, issuedAt, ...invoice});
        await redisClient.lpush('invoices', id);
        this.setStatus(200);
        return `${id}`;
    }
}

async function assertCustomerIdValid(customerId: string): Promise<void> {

    try {
        await superagent.get(`${process.env.CUSTOMERS_API}/Customers/${customerId}`);
    } catch (e) {
        if (e.status === 404) {
            throw {
                status: 400,
                field: 'customerId',
                error: `no customer found for id ${customerId}`
            }
        } else {
            console.error('Unexpected error from customers service', e);
            throw {
                status: 500,
                error: 'Failed to validate customer'
            }
        }
    }
}


async function assertProductIdValid(productId: string): Promise<void> {

    try {
        await superagent.get(`${process.env.PRODUCTS_API}/Products/${productId}`);
    } catch (e) {
        if (e.status === 404) {
            throw {
                status: 400,
                field: 'productId',
                error: `no product found for id ${productId}`
            }
        } else {
            console.error('Unexpected error from products service', e);
            throw {
                status: 500,
                error: 'Failed to validate product'
            }
        }
    }
}
