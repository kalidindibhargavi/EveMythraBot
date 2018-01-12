var Bluebird = require('bluebird');
var http = require("https");
var request = require("request");
var api='YV2YFP6AOS3FJLGOI55A';

module.exports = {
	EventList: function ( lCategory,tCategory,dkCategory) {
		
		return new Bluebird(function (resolve) {
			var url;
			console.log("hi in store.js")
			if(lCategory != null && dkCategory != null && tCategory != null ) {
				if(dkCategory == 'upcoming'){url = 'https://www.eventbriteapi.com/v3/events/search/?location.address=hyderabad&start_date.keyword=this_week&token='+api;}
				 
				
				if(tCategory == 'best'||tCategory == 'worst'){
					url = 'https://www.eventbriteapi.com/v3/events/search/?sort_by='+tCategory+'&location.address='+lCategory+'&start_date.keyword='+dkCategory+'&token='+api;
				} else if(tCategory == 'free'||tCategory == 'paid'){
					url = 'https://www.eventbriteapi.com/v3/events/search/?location.address='+lCategory+'&price='+tCategory+'&start_date.keyword='+dkCategory+'&token='+api;
				}
			} else if(lCategory != null && tCategory != null) {
				if(tCategory == 'best'||tCategory == 'worst'){
					url = 'https://www.eventbriteapi.com/v3/events/search/?sort_by='+tCategory+'&location.address='+lCategory+'&token='+api;
				} else if(tCategory == 'free'||tCategory == 'paid'){
					url = 'https://www.eventbriteapi.com/v3/events/search/?location.address='+lCategory+'&price='+tCategory+'&token='+api;
				} 
			} else if(lCategory != null) {
					url = 'https://www.eventbriteapi.com/v3/events/search/?location.address= '+lCategory+'&token='+api;
			}
			var options = { 
					method : 'GET',
					url : url,
					json : true,
			};
			
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
						//var s;
						//console.log('hi1')
						//s= body.events[i].name.text;
						if(!(body.events[i].url == null || body.events[i].logo == null || body.events[i].logo.url == null ) ) {
							elist.push({
								title: body.events[i].name.text,
							//text: body.events[i].description.text,
								image:body.events[i].logo.url,
								url: body.events[i].url							
							});
						}
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
