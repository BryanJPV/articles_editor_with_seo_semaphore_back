import * as https from 'https';
import express, { Express, Router } from 'express';
import cors from 'cors';

interface HttpHandler {
    init(app: Router): void
}

interface SSLCredentials{
    key: string
    cert: string
}

export class HttpAPI {
    app: Express;
    credentials: SSLCredentials | null;
    port: number;

    constructor (port: number, credentials: SSLCredentials | null = null) {
        const app: Express = express();

        app.use(express.json());
        app.use(express.raw());
        app.use(express.urlencoded({ extended: false }));
        app.use(cors({ origin: '*' }));

        // STTAIC FOLDER FOR MAIN APP
        app.use(express.static('public'))
        //app.use('/storage/img', express.static('public/podcasts/img'))
        //app.use('/storage/audio', express.static('public/podcast_episodes/audio'))

        this.app = app;
        this.port = port;
        this.credentials = credentials;
    }

    addAdminHandler (handler: HttpHandler) {
        let apiSubRouter = Router({mergeParams: true});
        handler.init(apiSubRouter);
        this.app.use('/api/admin', apiSubRouter)
    }

    addHandler (handler: HttpHandler) {
        let apiSubRouter = Router({mergeParams: true});
        handler.init(apiSubRouter);
        this.app.use('/api', apiSubRouter)
    }

    getExpressInstance() {
        return this.app;
    }

    run() {
        if (this.credentials != null) {
            https.createServer(this.credentials, this.app).listen(this.port, () => {
                console.log(`App de prueba escuchando por el puerto: ${this.port}`);
            });
            return;
        }
        
        this.app.listen(this.port, () => {
            console.log(`App de prueba escuchando por el puerto: ${this.port}`);
        })
    }
}