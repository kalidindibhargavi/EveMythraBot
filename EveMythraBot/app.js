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
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Sorry, I didnt understand.");
});

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2d2b2b09-de56-4787-97f1-987d108f4c76?subscription-key=8fc75abf1efb45cfbf265eae59031d1e&timezoneOffset=0&verbose=true';

var recognizer = new builder.LuisRecognizer(model);


bot.recognizer(recognizer);
bot.dialog('greetings', function (session,arg){
    session.sendTyping();
    session.send("Hey there!!!!");
    session.send(" Iam EveMythraBot");
     session.send({
   type: "message",
  text: "<ss type =\"wink\">;)</ss>"

    });
    session.endDialog(" Ask me Events an info of those events near you. I'll reccommend some for you\n\n  Type 'Help' if your stuck");
}).triggerAction({
    matches: 'greetings'
});

bot.dialog('SearchEvents',[
	function confirmQuery(session,args,next) {
		session.dialogData.entities=args.intent.entities;
		if(args.intent.entities==undefined) { 
			session.replaceDialog('help');
		} else {
			var locationEntity=builder.EntityRecognizer.findEntity(args.intent.entities,'builtin.geography.country');
			console.log(JSON.stringify(args.intent.entities[0]));
			if(args.intent.entities[0]==undefined) { 
				session.replaceDialog('help');
			} else {
				if(locationEntity!==null){
					session.dialogData.byLocation=true;
					session.dialogData.location=locationEntity.entity;
				}
				if(session.dialogData.genre ||session.dialogData.date||session.dialogData.location||session.dialogData.language) { 
					next();
				} else { 
					session.replaceDialog('help');
				}    
			}
		}
	},
	
	function getEventList(session,results,next){
		var loc=null;
		if(session.dialogData.byLocation) {
            loc=session.dialogData.location;
        }
		if(!(loc!=null)){ 
			session.endDialog('Request cancelled');
       }else {
            Store.EventList(loc)
            .then(function (elist) {
                //console.log("mlist"+JSON.stringify( mlist));
            
                //  console.log("type"+mlist.type);
                if(elist==null){
                    session.endDialog("Could not find Events in this location.\n Try with other location ");
                }
                else
                {
                      session.sendTyping();

                     setTimeout(function () {
                    var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(elist.map(eventsListAsAttachment));
                session.send(message);
                 }, 3000);
                 
            
                next();
            }
            });   
       }
 }
]).triggerAction({

    matches: 'SearchEvents'

});
       
		
/*
	
        

       */