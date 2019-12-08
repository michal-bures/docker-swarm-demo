import * as express from 'express';
import {RegisterRoutes} from './routes';
import "./controllers/products";
import * as bodyParser from 'body-parser';
import {NextFunction, Request, Response} from 'express';
import {Products} from './controllers/products';

main().catch(err => console.error('Uncaught error in main function', err));

async function main(): Promise<void> {

    await new Products().reset();

    const app = express();
    app.use(bodyParser.json());

    RegisterRoutes(app);

    app.use(errorMiddleware);

    app.listen(8080);
    console.log("Products service listening.");
}


function errorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 500;
    response
        .status(status)
        .send({
            status,
            ...error
        })
}
