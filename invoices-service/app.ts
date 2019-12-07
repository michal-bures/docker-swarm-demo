import * as express from 'express';
import {RegisterRoutes} from './routes';
import "./controllers/invoices";
import * as bodyParser from 'body-parser';
import {NextFunction, Request, Response} from 'express';

main().catch(err => console.error('Uncaught error in main function', err));

async function main(): Promise<void> {

    const app = express();
    app.use(bodyParser.json());

    RegisterRoutes(app);

    app.use(errorMiddleware);

    app.listen(8080);
    console.log("Invoices service listening.");
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
