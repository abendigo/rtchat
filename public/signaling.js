;(function() {
    'use strict';

// Create a random room if not already present in the URL.
var isInitiator;
var room = window.location.hash.substring(1);
if (!room) {
  room = window.location.hash = randomToken();
}
function randomToken() {
  return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
}
function logError(err) {
  console.log(err.toString(), err);
}

        let socket;
    class SignalingClient {
        
        constructor() {
            console.log('SignalingClient.constructor')
        }

        connect() {
            console.log('SignalingClient.connect')

    socket = io.connect();

    socket.on('ipaddr', function(ipaddr) {
        console.log('Server IP address is: ' + ipaddr);
        // updateRoomURL(ipaddr);
    });

    socket.on('created', function(room, clientId) {
        console.log('Created room', room, '- my client ID is', clientId);
        isInitiator = true;
        // grabWebCamVideo();
    });

    socket.on('joined', function(room, clientId) {
        console.log('This peer has joined room', room, 'with client ID', clientId);
        isInitiator = false;
        // createPeerConnection(isInitiator, configuration);
        // grabWebCamVideo();
    });

    socket.on('full', function(room) {
        alert('Room ' + room + ' is full. We will create a new room for you.');
        window.location.hash = '';
        window.location.reload();
    });

    socket.on('ready', () => {
        console.log('Socket is ready');
        // createPeerConnection(isInitiator, configuration);
        this.onready(isInitiator);
    });

    socket.on('log', function(array) {
        console.log.apply(console, array);
    });

    socket.on('message', (message) => {
        console.log('Client received message:', message);
        // signalingMessageCallback(message);
        this.onmessage(message);
    });

    // Join a room
    socket.emit('create or join', room);
        }

        static foobar() {
            console.log('SignalingClient.foobar')
        }

        send(message) {
            console.log('SignalingClient.send', message);
            socket.emit('message', message);
        }
    }

    window.SignalingClient = SignalingClient;

/*


    console.log('signaling.js')

    // Connect to the signaling server
    // socket.emit('ipaddr');


    function sendMessage(message) {
        console.log('Client sending message: ', message);
        socket.emit('message', message);
    }








var peerConn;
var dataChannel;

    function signalingMessageCallback(message) {
        if (message.type === 'offer') {
            console.log('Got offer. Sending answer to peer.');
            peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, logError);
            peerConn.createAnswer(onLocalSessionCreated, logError);

        } else if (message.type === 'answer') {
            console.log('Got answer.');
            peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, logError);

        } else if (message.type === 'candidate') {
            peerConn.addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate
            }));

        } else if (message === 'bye') {
        // TODO: cleanup RTC connection?
        }
    }

    function createPeerConnection(isInitiator, config) {
        console.log('Creating Peer connection as initiator?', isInitiator, 'config:', config);
        peerConn = new RTCPeerConnection(config);

        // send any ice candidates to the other peer
        peerConn.onicecandidate = function(event) {
            console.log('icecandidate event:', event);
            if (event.candidate) {
                sendMessage({
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                });
            } else {
                console.log('End of candidates.');
            }
        };

        if (isInitiator) {
            // console.log('Creating Data Channel');
            // dataChannel = peerConn.createDataChannel('photos');
            // onDataChannelCreated(dataChannel);

            console.log('Creating an offer');
            peerConn.createOffer(onLocalSessionCreated, logError);
        } else {
            peerConn.ondatachannel = function(event) {
                console.log('ondatachannel:', event.channel);
                dataChannel = event.channel;
                onDataChannelCreated(dataChannel);
            };
        }
    }
    
    function onLocalSessionCreated(desc) {
        console.log('local session created:', desc);
        peerConn.setLocalDescription(desc, function() {
            console.log('sending local desc:', peerConn.localDescription);
            sendMessage(peerConn.localDescription);
        }, logError);
    }

    function onDataChannelCreated(channel) {
        console.log('onDataChannelCreated:', channel);

        channel.onopen = function() {
            console.log('CHANNEL opened!!!');
        };

        channel.onmessage = function(event) {
            console.log('onmessage', event)
        };
    }
*/
}());
