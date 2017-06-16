var Promise = require('bluebird');
var http = require("https");
var request = require("request");
var api='XSWQAVR2DCBJM2C4Y2SQ';

module.exports = {
	EventsList: function ( lCategory) {
        return new Promise(function (resolve) {
			if(lCategory != null) {
				var options = { 
					method : 'GET',
					url : 'https://www.eventbriteapi.com/v3/events/search/?location.',
					qs : {
						address : loc,
						token : api
					},
					json = true,
					body : '{}'
				};
			}
			request(options, function (error, response, body) {
				if (error) throw new Error(error);
				console.log()
				if(!error && body.results!=undefined) {
					var mlist = [];
					for (var i = 0; i <body.results.length&& i< 10; i++) {
						var s;
						s= body.results[i].title;
						mlist.push({
							title: body.results[i].title,
							subtitle:body.results[i].release_date,
							text: body.results[i].original_language
						});
						if(mlist.length==0){
							mlist=null;
						}
						setTimeout(function () { resolve(mlist); }, 1000);
					}
				}
			});
		});
	}
}