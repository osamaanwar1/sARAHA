import express from 'express';
const app = express();
import conf from './config/config.service.js'
import {connection} from './database/connection.js'
import {mainRouter} from "./module/route.js";
import {notFound} from "./common/middleware/notfound.js";
import {errorHandler} from "./common/utils/errorHandler.js";
await connection()
import cors from 'cors'
import * as crypto from "node:crypto";

app.use(cors(),express.json())
app.use(mainRouter)

app.use(notFound);
app.use(errorHandler);

app.listen(conf.port, () => {console.log(`Listening on port ${conf.port}`)})