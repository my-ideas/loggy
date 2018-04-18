# loggy

A logging module that wrpas winston/console.log

When running in a standalone node application, if the env variable `LOGGY_CW_GROUPNAME` is set, send logs to CloudWatch Logs 

If the code is running in an AWS Lambda function, logs are sent to CloudWatch using the standard console.log (thus saving an API call for each log statement)

## How to use
Install the module `npm install --save @my-ideas/loggy` and then use it in your code
```javascript

const Loggy = require('./index');

// __filename is mandatory, the latter object is optional and always added to each log statement 
const log = new Loggy(__filename, {env: 'environment'});

exports.handler = async (event) => {

    // Can log a simple message (or a simple object)
    log.info("A simple message");
    
    // Can log a message with a context object
    log.debug("A message", {
        context: "this is a context object",
        daje: true
    });

    log.error(new Error("How to log an error?"));

    return 'Hello from Lambda!'
};


```
