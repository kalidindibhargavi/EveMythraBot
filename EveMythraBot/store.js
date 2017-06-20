var Bluebird = require('bluebird');
var http = require("https");
var request = require("request");
var api='XSWQAVR2DCBJM2C4Y2SQ';

module.exports = {
	EventList: function ( lCategory) {
		console.log('hi')
		return new Bluebird(function (resolve) {
			if(lCategory != null) {
				var options = { 
					method : 'GET',
					url : 'https://www.eventbriteapi.com/v3/events/search/?location.address= '+lCategory+'&token='+api,
					json : true,
			};
				
		}
			
			request(options, function (error, response, body) {
				console.log(error);
				console.log(response);
				console.log(body);
				
				if (error) throw new Error(error);
					console.log()
				if(!error && body.results!=undefined) {
					var elist = [];
					for (var i = 0; i <body.results.length&& i< 10; i++) {
						var s;
						s= body.results[i].title;
						elist.push({
							title: body.results[i].title,
							subtitle:body.results[i].release_date,
							text: body.results[i].original_language
						});
						if(elist.length==0){
							elist=null;
						}
						setTimeout(function () { resolve(elist); }, 1000);
					}
				}
			});
		});
	}
}