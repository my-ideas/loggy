const AWS = require("aws-sdk");

function metaParse(str) {
    return eval('`'+str+'`');
}

function Loggy(fileName, context, out = console.log) {

    if(!fileName){
        throw new Error("First argument __filename is mandatory");
    }

    this.fileName = require('path').basename(fileName);
    this.ctx = context;

    if(process.env.LOGGY_CW_GROUPNAME) {
        this.buffer = [];
        this.out = (message) => {
            console.log(message);
            this.buffer.push({message, timestamp: new Date().getTime()});
        }
    }
    else {
        this.out = out;
    }

    const debugLog = (mess) => {
        // do nothing
    };


    if(process.env.LOGGY_CW_GROUPNAME) {
        // Setup the CloudWatch poller
        const logGroupName = metaParse(process.env.LOGGY_CW_GROUPNAME);
        console.log(`logGroupName: ${logGroupName}`);
        const logStreamName = require('os').hostname();
        const cwPublishInterval = -1;
        const cw = new AWS.CloudWatchLogs();

        this.sequenceToken = "";

        cw.createLogGroup({ logGroupName }).promise()
            .catch(err => {
                if(err.code === "ResourceAlreadyExistsException") {
                    return {};
                }
                throw err;
            })
            .then(res => {
                debugLog(res);
                return cw.createLogStream({ logGroupName, logStreamName }).promise();
            })
            .catch(err => {
                if(err.code === "ResourceAlreadyExistsException") {
                    return {};
                }
                throw err;
            })
            .then(() => {
                // Get the sequence token
                return cw.describeLogStreams({
                    logGroupName,
                    logStreamNamePrefix: logStreamName
                }).promise();
            })
            .then(streams => {
                debugLog(streams);
                return streams.logStreams.filter(s => s.logStreamName === logStreamName)[0]
            })
            .then(logStream => {
                debugLog(logStream);
                this.sequenceToken = logStream.uploadSequenceToken;
                return logStream.uploadSequenceToken;
            })
            .then(token => {

                this.cwPublishInterval = setInterval(() => {
                    debugLog(`      --> Sending to CW - [${this.buffer.length}] [${this.sequenceToken}]`);
                    const bufferCopy = this.buffer.slice(0);

                    if(bufferCopy.length === 0) {
                        debugLog(`      --> NOTHING to sentd - [${this.buffer.length}] [${this.sequenceToken}]`);
                        return;
                    }

                    cw.putLogEvents({
                        logEvents: bufferCopy,
                        logGroupName,
                        logStreamName,
                        sequenceToken: this.sequenceToken
                    }).promise()
                    .then(res => {
                        this.sequenceToken = res.nextSequenceToken;
                        this.buffer = this.buffer.slice(bufferCopy.length);
                        debugLog(`      --> SENT - [${this.buffer.length}] [${this.sequenceToken}]`);
                    })
                }, 500)
            })

    }


}
//
Loggy.prototype.log = function(logEvent, level, context = undefined){

    const logMessage = {};
    logMessage.message = '';
    logMessage.level = level;
    logMessage.time = `${new Date()}`;
    logMessage.stage = process.env.STAGE || process.env.stage;
    logMessage.meta = { __script: this.fileName };


    // Map an Error
    mapError = (err) => JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

    if(typeof logEvent === 'string'){
        logMessage.message = logEvent;
    }
    else if(logEvent instanceof Error ){
        logMessage.message = logEvent.message;
        logMessage.meta.error = mapError(logEvent);
    }

    if (context && context instanceof Error) {
        logMessage.meta.error = mapError(context);
    }
    else if(context) {
        logMessage.meta = Object.assign(logMessage.meta , context, this.ctx);
    }


    if(logMessage.message === '') {
        delete logMessage.message;
    }

    // Handy for console and debug. Not for journalctl
    this.out(JSON.stringify(Object.assign(logMessage, this.data), null, 4) + "\n");
};


Loggy.prototype.debug = function(logEvent, context = undefined){
    this.log(logEvent, 'debug', context);
};

Loggy.prototype.info = function(logEvent, context = undefined){
    this.log(logEvent, 'info', context);
};

Loggy.prototype.warn = function(logEvent, context = undefined){
    this.log(logEvent, 'warn', context);
};

Loggy.prototype.error = function(logEvent, context = undefined){
    this.log(logEvent, 'error', context);
};


module.exports = Loggy;