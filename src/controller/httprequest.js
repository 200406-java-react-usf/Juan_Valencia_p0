var axios = require('axios');
var response = '';
var persist = new Array();
axios.get('http://api.pathofexile.com/ladders/SSF%20Metamorph%20HC?realm=pc&limit=10&accountName=Steelmage')
    .then(function (response) {
    persist = response.data.entries;
    //console.log(persist)
    for (var _i = 0, persist_1 = persist; _i < persist_1.length; _i++) {
        var x = persist_1[_i];
        var persistObj = persist.shift();
        console.log(persistObj);
    }
})["catch"](function (err) {
    console.log(err);
});
