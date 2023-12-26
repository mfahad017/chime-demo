import express from 'express';
import router from './routes/chime';
import * as dotenv from 'dotenv';
import { join } from 'path';
import cors from 'cors';

dotenv.config({
  path: join(__dirname, '../.env.dev'),
});

const app = express();

app.use(express.json());

app.use(cors());

app.use(router);

export default app;
