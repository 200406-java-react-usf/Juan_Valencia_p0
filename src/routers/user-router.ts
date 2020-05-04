import url from 'url';
import express from 'express';
import { User } from '../models/user';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { adminGuard } from '../middleware/auth-middleware';
import { AuthorizationError } from '../errors/errors';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', adminGuard, async (req, resp) => {
    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            return resp.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            return resp.status(200).json(payload);
        }

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

UserRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await userService.getUserById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

UserRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await userService.addNewUser(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }

});

UserRouter.delete('', adminGuard, async (req, resp) => {

    console.log('DELETE REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        if(req.body.id == 1){
            throw new AuthorizationError();
        }
        await userService.deleteById(+req.body.id);
        resp.sendStatus(204);

    }
    catch(e){
        resp.status(e.statusCode).json(e).send();
    }
    //resp.send();
});

UserRouter.put('', adminGuard, async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await userService.updateUser(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }

});