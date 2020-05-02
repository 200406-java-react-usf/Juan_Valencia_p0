import express from 'express';
import AppConfig from '../config/app'
import axios from 'axios';

export const CharRouter = express.Router();

//const charService = AppConfig.charService;

CharRouter.post('', (req, resp) => {
    let result;
    let acName = req.body.accountName;
    let leagueName = 'SSF%20Metamorph%20HC';
    console.log(`the body ---- ${req.body} ----- \n the account name ---- ${req.body.accountName} -----`);
        axios.get('http://api.pathofexile.com/ladders/' + leagueName , {
            params: {
                realm: 'pc',
                limit: 10,
                accountName: acName
            }
        })
            .then(response => {
                console.log('made it here' + response.data.entries[0].character.name);
                result = response.data.entries;
                console.log('should not be empty ' + result)
                if (result) {
                    resp.status(200).json(result);
                }
                resp.sendStatus(404);
            });

});

