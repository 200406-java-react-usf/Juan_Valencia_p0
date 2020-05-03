import express from 'express';
import AppConfig from '../config/app';

export const StatRouter = express.Router();

const statService = AppConfig.statService;

StatRouter.get('',  async (req, resp) => {
    try {
        let payload = await statService.getAllStats();
        return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});