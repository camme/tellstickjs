// basic imports
var events = require('events');

// inherit events.EventEmitter
var net = require('net');
var socket = new net.Socket({
    type: 'unix'
});


function TelldusEvents() {
    events.EventEmitter.call(this);

    var self = this;
    var socket = net.createConnection('/tmp/TelldusEvents');


    var lastUnitEvents = {};

    socket.on('errror', function(err) {
        console.log(err);
    });

    socket.on('data', function(bufferData) {
        var data = parseTelldusEvent(bufferData);

        for(var i = 0, ii = data.length; i < ii; i++) {
            var event = data[i];
            ////console.log(event);
            if (event.protocol == 'arctech') {
                var cachedEvent = lastUnitEvents[event.unit];
                if (cachedEvent) {
                    //console.log("T:", cachedEvent.method != event.method, cachedEvent.time < new Date().getTime() - 1000);
                }
                // check if the event is cached, if the cashe value is different or if the cache has expired
                if (!cachedEvent || cachedEvent.method != event.method || cachedEvent.time < new Date().getTime() - 1000) {
                    if (event.method == 'turnon') {
                        self.emit('turnon', event);
                    }
                    if (event.method == 'turnoff') {
                        self.emit('turnoff', event);
                    }
                    lastUnitEvents[event.unit] = {
                        method: event.method,
                        time: new Date().getTime()
                    }
                }
            }
        }

    });

    function parseTelldusEvent(buffer) {

        var events = [];
        var data = buffer.toString();

        var re = /((\d+\:TDRawDeviceEvent.+?)i1s)/g;

        var eventData = re.exec(data);

        while(eventData) {

            var event = eventData[2];
            //console.log("EVENT:", event);
            event = event.replace(/^\d+\:/, '');
            var pairs = event.split(";");
            var parsedData = {};
            for(var i = 0, ii = pairs.length; i < ii; i++) {
                var pair = pairs[i];
                var keyValue = pair.split(":");
                if (i == 0) {
                    parsedData.data = keyValue[0];
                    parsedData[keyValue[1]] = keyValue[2];
                }
                else if (keyValue.length == 2) {
                    parsedData[keyValue[0]] = keyValue[1];
                }
                else {
                    //parsedData.extra.push(keyValue[0]);
                }
            }
            events.push(parsedData);
            eventData = re.exec(data);
        }

        console.log(events);
        return events;
        return parsedData;
    }
}

TelldusEvents.super_ = events.EventEmitter;
TelldusEvents.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: TelldusEvents,
        enumerable: false
    }
});

var instance = null;
exports.init = function() {
    if (!instance) {
        instance = new TelldusEvents();
    }
    return instance;
}



/*
   var server = net.createServer(function (socket) {
   console.log("connected");
   socket.on('data', function(data) {
   console.log(data);
   });
   }).listen("/tmp/TelldusEvents");


   server.listen("/tmp/TelldusEvents", function() {
   console.log("data");
   });
   */

//socket.connect('/tmp/TelldusEvents', function() {console.log(arguments)});


