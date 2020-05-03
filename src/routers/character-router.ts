import express from 'express';
import AppConfig from '../config/app'
import httprequest from '../requests/character-request'

export const CharRouter = express.Router();

//const charService = AppConfig.charService;

CharRouter.post('', async (req, resp) => {
    let result;
    let acName = req.body.accountName;
    let lName = req.body.leagueName;
    result = await httprequest(lName, acName);
    if (!result[0]) {
        resp.sendStatus(404);
    }
    else {
        result.forEach(entry => {
           // await charService.addNewCharacter(entry);
        });
    }
    

});

