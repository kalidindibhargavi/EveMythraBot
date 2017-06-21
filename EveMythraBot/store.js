var Bluebird = require('bluebird');
var http = require("https");
var request = require("request");
var api='XSWQAVR2DCBJM2C4Y2SQ';

module.exports = {
	EventList: function ( lCategory) {
		
		return new Bluebird(function (resolve) {
			if(lCategory != null) {
				var options = { 
					method : 'GET',
					url : 'https://www.eventbriteapi.com/v3/events/search/?location.address= '+lCategory+'&token='+api,
					json : true,
			};
				
		}
			
			request(options, function (error, response, body) {
				//console.log(error);
				//console.log(response);
				//console.log(body);
				
				if (error) throw new Error(error);
					console.log()
				if(!error && body.events!=undefined) {
					var elist = [];
					//console.log('hi')
					for (var i = 0; i <body.events.length&& i< 10; i++) {
						var s;
						//console.log('hi1')
						s= body.events[i].name.text;
						elist.push({
							title: body.events[i].name.text,
							text: body.events[i].description.text,
							image:body.events[i].logo.url,
							url: body.events[i].url
							
						});
						if(elist.length==0){
							elist=null;
						}
						//console.log(elist)
						setTimeout(function () { resolve(elist); }, 1000);
					}
				}
			});
		});
	}
}