;(function() {
    'use strict';

    console.log('main.js')

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

startButton.onclick = createConnection;
sendButton.onclick = sendData;
// closeButton.onclick = closeDataChannels;
    


var signalingChannel = new SignalingClient();
var configuration = null; //{ "iceServers": [{ "urls": "stuns:stun.example.org" }] };
var pc;
// var channel;

// call start(true) to initiate
function start(isInitiator) {
    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        signalingChannel.send({ "candidate": evt.candidate });
    };

    // let the "negotiationneeded" event trigger offer generation
    pc.onnegotiationneeded = function () {
        pc.createOffer().then(function (offer) {
            return pc.setLocalDescription(offer);
        })
        .then(function () {
            // send the offer to the other peer
            signalingChannel.send({ "desc": pc.localDescription });
        })
        .catch(logError);
    };

    if (isInitiator) {
        // create data channel and setup chat
        var channel = pc.createDataChannel("chat");
        setupChat(channel);
    } else {
        // setup chat on incoming data channel
        pc.ondatachannel = function (evt) {
            var channel = evt.channel;
            setupChat(channel);
        };
    }
}

signalingChannel.onmessage = function (evt) {
    console.log('onmessage', evt, evt.data)
    if (!pc)
        start(false);

    // var message = JSON.parse(evt.data);
    var message = evt;
    if (message.desc) {
        var desc = message.desc;

        // if we get an offer, we need to reply with an answer
        if (desc.type == "offer") {
            pc.setRemoteDescription(desc).then(function () {
                return pc.createAnswer();
            })
            .then(function (answer) {
                return pc.setLocalDescription(answer);
            })
            .then(function () {
                signalingChannel.send({ "desc": pc.localDescription });
            })
            .catch(logError);
        } else
            pc.setRemoteDescription(desc).catch(logError);
    } else
        pc.addIceCandidate(message.candidate).catch(logError);
};

signalingChannel.onready = function (isInitiator) {
    console.log('onready', isInitiator)
    if (isInitiator)
        start(isInitiator);
}

function createConnection() {
    signalingChannel.connect();
}

var channel;
function setupChat(_channel) {
    channel = _channel;
    channel.onopen = function () {
        console.log('channel.onopen')
        // e.g. enable send button
        // enableChat(channel);
        // sendChatMessage('this is a chat message')
        dataChannelSend.disabled = false;
        dataChannelSend.focus();        
    };

    channel.onmessage = function (evt) {
        console.log('channel.onmessage', evt)
        // showChatMessage(evt.data);
        dataChannelReceive.value = event.data;
    };
}

function sendChatMessage(msg) {
    console.log('sendChatMessage', msg)
    channel.send(msg);
}

function logError(error) {
    console.log(error.name + ": " + error.message);
}






function sendData() {
  var data = dataChannelSend.value;
  sendChatMessage(data);
}


}());
