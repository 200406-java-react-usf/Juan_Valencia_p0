import axios from 'axios';

let persist;
let httprequest = () => {
axios.get('http://api.pathofexile.com/ladders/SSF%20Metamorph%20HC', {
    params: {
        realm: 'pc',
        limit: 10,
        accountName: 'Steelmage'
    }
})
.then(response => {
    let result = response.data.entries;
    console.log(result);
});

}
