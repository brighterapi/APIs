/*
  Copyright 2017 Brighter API.
*/
'use strict';


var http =require('http')

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

		//Start New Session
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

		//Launch Request Where application Get started
        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
			//Check if it is Intent Request
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
			//Session End Request
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
		//Exceptin Catch
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle = "Hello, Brighter API!"
    var speechOutput = "Hello User, Welcome to Brighter API, what smart solution I can provide for you ?"
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", true));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'BrighterAPIIntent') {
        handleBrighterAPIRequest(intent, session, callback);
    }else if(intentName == 'BookingIntent'){
		handleBookingIntent(intent, session, callback);
	}
    else {
        throw "Invalid intent";
    }
}
/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

function handleBrighterAPIRequest(intent, session, callback) {
    var samplecode = intent.slots.samplecode.value;
    if(samplecode == 'brighterapi'){	
         callback(session.attributes,
         buildSpeechletResponseWithoutCard("BrighterAPI is taking initiative for create communities who needs help in solving challenges and making them strong into Algorithms, data structure and APIs using deeply understandable video explanation.", "", "true"));
    }else  if(samplecode === 'Hackerrank' || samplecode==='hackerrank'){
        callback(session.attributes,
         buildSpeechletResponseWithoutCard("Best Hackkerrank tutorial at BrighterAPI.com", "", "true"));
    } else if(samplecode === 'Holiday' || samplecode ==='holiday'){
         callback(session.attributes,
         buildSpeechletResponseWithoutCard("Next Holiday in India on 26-June-2017", "", "true"));
    }else if(samplecode === undefined){
        callback(session.attributes,
         buildSpeechletResponseWithoutCard("Sorry, I dont know that.", "", "true"));
    }
    
}

function handleBookingIntent(intent, session, callback) {
    var bookingcode = intent.slots.bookingcode.value;
    if(bookingcode == '12345'){
         callback(session.attributes,
         buildSpeechletResponseWithoutCard("Your Booking Status for ID "+ bookingcode +" is booked", "", "true"));
    }else  if(bookingcode === '23456'){
        callback(session.attributes,
         buildSpeechletResponseWithoutCard("Your Booking Status for ID "+ bookingcode +" is Cancel", "", "true"));
    } else if(bookingcode === '123456'){
         callback(session.attributes,
         buildSpeechletResponseWithoutCard("Your Booking Status for ID "+ bookingcode +" is In Progress", "", "true"));
    }else if(bookingcode === undefined){
        callback(session.attributes,
         buildSpeechletResponseWithoutCard("Sorry, we are not able to fetch it this booking, kindly contact concern department", "", "true"));
    }else{
		callback(session.attributes,
         buildSpeechletResponseWithoutCard("Sorry, we are not able to fetch it this booking, kindly contact concern department", "", "true"));
	}
}

// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}