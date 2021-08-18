import * as  express from 'express';
import * as mongoose from "mongoose";
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import {Request, Response} from "express";
import { environment } from './environments/environment.dev';
import UserRouter from './routers/user-router';

export class Server {
    corsOptions: cors.CorsOptions = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: '*',
        preflightContinue: false
    };
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        const MONGO_URI: string = environment.db_url;
        mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
        mongoose.connection.on('connected', function () { console.log("connected to database"); });
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use('*', cors(this.corsOptions));
    }
    routes() {
		this.app.use('/api/user', UserRouter);
        this.app.use(this.logErrors);
        this.app.use(this.errorHandle);
    }

    errorHandle(error, req, res, next) {
        {
            res.status(error.status || 500);
            res.json({
                error: error.message
            })
        }
    }

    logErrors(req, res, next) {
        let error: any;
        error = new Error('Not Found');
        error.status = 404;
        next(error)
    }
}

export default new Server().app;
