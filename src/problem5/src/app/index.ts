import express from 'express';
import resourceRoute from "../routes/resource.route";
import {Services} from "../services";
import {MikroORM} from "@mikro-orm/core";
import config from '../configs/mikro-orm.config';


export const app = async () => {
    const orm = await MikroORM.init(config);
    const s = new Services(orm.em.fork());
    const e = express();
    e.use(express.json());
    e.use('/resource', resourceRoute(express.Router(), s))
    return e;
}
