import express, { Express, Request, Response} from 'express';
import cors from 'cors';
import xmlparser from 'express-xml-bodyparser';
import { retrieveDrones } from './loop'

const app: Express = express();


app.use(express.json());
app.use(express.urlencoded());
app.use(xmlparser({
    normalizeTags: false
}));

// For debugging
app.use((req: Request, res: Response, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});


app.use(cors());


retrieveDrones();



export { app };