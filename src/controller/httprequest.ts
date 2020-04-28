import axios from 'axios';

let response = '';
let persist = new Array();
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
    console.log(response.data.entries);
});

}
