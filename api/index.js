
import { AngularNodeAppEngine } from '@angular/ssr/node';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
    try {

        const app = express();
        const angularApp = new AngularNodeAppEngine();

        const browserDistFolder = path.join(process.cwd(), 'dist', 'social-app', 'browser');

        app.use(express.static(browserDistFolder, {
            maxAge: '1y',
            index: false,
            redirect: false,
        }));

        app.use('*', async (req, res, next) => {
            try {
                const response = await angularApp.handle(req);
                if (response) {
                    res.status(response.status || 200);
                    response.headers.forEach((value, key) => {
                        res.setHeader(key, value);
                    });

                    const text = await response.text();
                    res.send(text);
                } else {
                    next();
                }
            } catch (error) {
                console.error('SSR Error:', error);
                next(error);
            }
        });

        // تنفيذ الطلب
        return app(req, res);
    } catch (error) {
        console.error('Server initialization error:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
}