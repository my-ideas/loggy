/*
    A very simple wrapper to console.log
 */
const extend = require('util')._extend;


/**
 * Wrap console.log with some sugar to AWS CloudWatch Logs
 * @param scriptSource Always pass __filename here
 * @param data Object an object that is always appended to each log statement
 * @constructor
 */
function Loggy(scriptSource, data) {

    // sriptsource is __filename.
    // Remove from the path everything that is up to the module folder, and assume that the module name match the module folder
    let appRootDir = require('app-root-dir').get().split('/');
    appRootDir.pop();
    appRootDir = appRootDir.join('/');

    let source = scriptSource.replace(appRootDir, '').replace(/\//g, '.');
    if(source.startsWith('.')){
        source = source.replace('.','');
    }

    this.scriptName = source;
    this.data = data || {};

}

Loggy.prototype.log = function(logEvent, level){
    if(typeof logEvent !== 'object'){
        logEvent = {message: (logEvent || '')};
    }
    else if(logEvent.error && logEvent.error instanceof Error){
        logEvent = extend({
            errorName: logEvent.error.name,
            errorMessage: logEvent.error.message,
            errorStack: logEvent.error.stack
        }, logEvent);
        delete logEvent.error;
    }

    logEvent.level = level;
    logEvent.source = this.scriptName;
    logEvent.elyenv = process.env.elyenv;

    console.log(JSON.stringify(extend(logEvent, this.data)));
};

Loggy.prototype.debug = function(logEvent){
    this.log(logEvent, 'debug');
};

Loggy.prototype.info = function(logEvent){
    this.log(logEvent, 'info');
};

Loggy.prototype.warn = function(logEvent){
    this.log(logEvent, 'warn');
};

Loggy.prototype.error = function(logEvent){
    this.log(logEvent, 'error');
};


module.exports = Loggy;