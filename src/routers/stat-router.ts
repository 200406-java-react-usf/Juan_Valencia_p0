import express from 'express';
import {statService} from '../config/app';

export const StatRouter = express.Router();

const statServices = statService;

StatRouter.get('',  async (req, resp) => {
    try {
        let payload = await statServices.getAllStats();
        return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});