import axios from 'axios';
import { InternalServerError, BadRequestError } from '../errors/errors';
import { isValidStrings } from '../util/validator';

/**
     * Using Axios send an http request to http://api.pathofexile.com/ladders/ 
     * to retrieve the character of given account name and league name
     * @param lName the past or currently league name, use SSF before the 
     * league name if its Solo Self Found and HC after the league name if its Hardcore
     * @param acName provide the account name you want to retrieve only supports PC account names
     */
let httprequest = async (lName: string, acName: string) => {
    
    let result;
    if(!isValidStrings(lName) || !isValidStrings(acName)){
        throw new BadRequestError();
    }
    lName.replace(' ','%20');
    console.log(lName);
    await axios.get('http://api.pathofexile.com/ladders/' + lName, {
        params: {
            realm: 'pc',
            limit: 10,
            accountName: acName
        }
    })
        .then(response => {
            result = response.data.entries;
            return result;
        })
        .catch(err => {
            throw new InternalServerError(err);
        })

    console.log(result);
    return result;

}

export default httprequest;
