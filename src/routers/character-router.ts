import express from 'express';
import AppConfig from '../config/app';
import httprequest from '../requests/character-request';
import { adminGuard } from '../middleware/auth-middleware';
import { ResourceNotFoundError } from '../errors/errors';

export const CharRouter = express.Router();

const charService = AppConfig.charService;
const statService = AppConfig.statService;

CharRouter.post('', async (req, resp) => {
    let result;
    let acName = req.body.accountName;
    let lName = req.body.leagueName;
    result = await httprequest(lName, acName);
    if (!result[0]) {
        resp.status(404).json(new ResourceNotFoundError());
    }
    else {
        try {
            console.log('POST REQUEST RECEIVED AT /Character');
            await charService.addNewChar(result, acName, lName);
            await statService.addStats(result, acName);
            resp.status(201).send();
        }
        catch (e) {
            resp.sendStatus(e.statusCode);
        }
    }

});

CharRouter.get('', async (req, resp) => {
    try {

        let payload = await charService.getAllChars();
        return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

CharRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await charService.getCharById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

CharRouter.put('', async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await charService.updateChar(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }

});

CharRouter.delete('', adminGuard, async (req, resp) => {

    console.log('DELETE REQUEST RECEIVED AT /Characters');
    console.log(req.body);
    try {
        await charService.deleteById(+req.body.id);
        resp.sendStatus(204);

    }
    catch (e) {
        resp.status(e.statusCode).json(e).send();
    }
    //resp.send();
});

