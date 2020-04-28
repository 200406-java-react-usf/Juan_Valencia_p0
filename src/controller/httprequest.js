var axios = require('axios');
var response = '';
var persist = new Array();
// axios.get('http://api.pathofexile.com/ladders/SSF%20Metamorph%20HC?realm=pc&limit=10&accountName=Steelmage')
//     .then(response => {
//         persist = response.data.entries
//         //console.log(persist)
//         for(let x of persist){
//             let persistObj = persist.shift();
//             console.log(persistObj);
//         }
//     })
//     .catch(err => {
//         console.log(err)
//     });
axios.get('http://api.pathofexile.com/ladders/SSF%20Metamorph%20HC', {
    params: {
        realm: 'pc',
        limit: 10,
        accountName: 'Steelmage'
    }
})
    .then(function (response) { return console.log(response); });
