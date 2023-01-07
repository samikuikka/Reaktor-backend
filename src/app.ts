import express, { Express, Request, Response} from 'express';
import cors from 'cors';

const app = express();

//this is here just for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get('/ping', async (req: Request, res: Response) => {
    res.send('Pong!');
})

app.use(cors());

export { app };