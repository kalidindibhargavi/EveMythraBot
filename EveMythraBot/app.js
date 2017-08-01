var restify = require('restify');
var builder = require('botbuilder');
var Store = require('./store');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8080, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "9e8ee05c-7044-4571-bea9-3cbe4cf9420e",//process.env.MICROSOFT_APP_ID,
    appPassword: "K4AM6yznCRh4ZXgegjsg2JR"//process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

//default message when exceptions occur
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Sorry, I didnt understand. Type 'Help' to interact more with me");
});

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2d2b2b09-de56-4787-97f1-987d108f4c76?subscription-key=8fc75abf1efb45cfbf265eae59031d1e&timezoneOffset=0&verbose=true';

var recognizer = new builder.LuisRecognizer(model);

bot.recognizer(recognizer);
bot.dialog('greetings', function (session,arg){
    session.sendTyping();
    session.send("Greetings Majesty!!!!");
    session.send({
   type: "message",
  text: "<ss type =\"pray\">(pray)</ss>"

    });
    session.send("EveMythraBot at your Service");
     session.send({
   type: "message",
  text: "<ss type =\"bow\">(bow)</ss>"

    });
    //session.send("Majesty can you please tell me at which place are you looking for events");
    session.endDialog("Want to know about me type 'Help'");
}).triggerAction({
    matches: 'greetings'
});

bot.dialog('SearchEvents',[
	function confirmQuery(session,args,next) {
		session.dialogData.entities=args.intent.entities;
		if(args.intent.entities==undefined) { 
			session.replaceDialog('Help');
		} else {
            var typeEntity=builder.EntityRecognizer.findEntity(args.intent.entities,'Events.Type');
            //var nameEntity=builder.EntityRecognizer.findEntity(args.intent.entities,'Events.Name');
	    var locationEntity=builder.EntityRecognizer.findEntity(args.intent.entities,'Events.PlaceName');
            var dateKeywordEntity=builder.EntityRecognizer.findEntity(args.intent.entities,'Events.DateKeyword');
	    //console.log(dateKeywordEntity.entity);
            //console.log(JSON.stringify(args.intent.entities[0]));
            //console.log(JSON.stringify(args.intent.entities[1]));
			
            if(args.intent.entities[0] == undefined) { 
				session.replaceDialog('Help');
			} else {
                if(locationEntity !== null && typeEntity !== null && dateKeywordEntity !== null ){
					session.dialogData.byDateKeyword = true;
					session.dialogData.location = locationEntity.entity;
                    session.dialogData.type = typeEntity.entity;
                    session.dialogData.dateKeyword = dateKeywordEntity.entity;
                    //console.log(session.dialogData.type);
                    next();
                } else if(locationEntity !== null && typeEntity !== null){
					session.dialogData.byType = true;
					session.dialogData.location = locationEntity.entity;
                    session.dialogData.type = typeEntity.entity;
                    //console.log(session.dialogData.type);
                    next();
				} else if(locationEntity !== null) {
                    session.dialogData.byLocation = true;
					session.dialogData.location = locationEntity.entity;
                    next();
				} else { 
					session.replaceDialog('Help');
				}    
			}
		}
	},
	function getEventList(session,results,next){
		var loc=session.dialogData.location;
        if(session.dialogData.byType) {
            var type = session.dialogData.type;
        } else if(session.dialogData.byDateKeyword) {
            var dateKeyword = session.dialogData.dateKeyword;
        }
        
		if(loc == null) { 
			session.endDialog('Please be more specific by mentioning the location like "Events at hyderbad" or "Upcoming events at delhi"');
       } else {
           //console.log(type+'in getEventsList');
           //console.log(loc);
            Store.EventList(loc,type,dateKeyword)            
            .then(function (elist) {
                //console.log("mlist"+JSON.stringify( mlist));
            //console.log("hi after evntlist function call");
                //  console.log("type"+mlist.type);
                
                if(elist==null){
                    session.endDialog("Could not find Events with your preference.\n Try some other preferences");
                }
                else
                {
                      session.sendTyping();
                      session.send("Here are some of the suggestions");
                     setTimeout(function () {
                    var message = new builder.Message()

                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(elist.map(e => new builder.HeroCard(session)
                    .title(e.title)
                    //.text(e.text)
                    .images([
                        builder.CardImage.create(session, e.image)
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session,e.url,'Register')
                    ])));
                session.send(message);
                 }, 3000);
                 session.send("For registering to any of the events click on the register button");
                 
            
                next();
            }
            });   
       }
 }
]).triggerAction({

    matches: 'SearchEvents'

});

bot.dialog('Help', function (session,arg){
    session.sendTyping();
    session.send("Your majesty, I can help you find events.Try asking me questions like");
    session.send("1. what are the events happening in (location).");
    session.send("2. free events in (location).");
    session.send("3. events happening today in (location)");
    session.send("4. paid events happening today in (location)");
    //session.send("")
    session.endDialog("Locations can be Hyderabad, Chennai, Bangalore, Hitecity");
}).triggerAction({
    matches: 'Help'
});
