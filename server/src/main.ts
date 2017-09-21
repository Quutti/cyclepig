import * as express from 'express';
import * as dotenv from 'dotenv';
import * as mysql from 'easy-mysql-with-promise';

import { launchServer, ServerSettings } from './server';

dotenv.config();

const app = express();
const settings: ServerSettings = {
    port: parseInt(process.env.SERVER_PORT, 10) || 8080
}

mysql.init({
    host: process.env.SQL_HOST,
    port: parseInt(process.env.SQL_PORT, 10) || 3306,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
    connectionLimit: parseInt(process.env.SQL_CONN_LIMIT, 10) || 50
});

launchServer(app, settings);
