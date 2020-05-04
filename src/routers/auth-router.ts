import express from 'express';
import {userService} from '../config/app';
import { Principal } from '../models/principal';

export const AuthRouter = express.Router();

const userServices = userService;

AuthRouter.get('', (req, resp) => {
    delete req.session.principal;
    resp.status(204).send();
});

AuthRouter.post('', async (req, resp) => {

    try {

        const { username, password } = req.body;
        let authUser = await userServices.authenticateUser(username, password);
        let payload = new Principal(authUser.id, authUser.username, authUser.account_name);
        req.session.principal = payload;
        resp.status(200).json(payload);
        
    } catch (e) {
        resp.status(e.statusCode || 500).json(e);
    }

    resp.send();

});
