# loggy

Not even a module.

Loggy expose methods to log statement. A log event can by 

* `log.info(message: string)`
* `log.info(object: object)`
* `log.info(message: string, object: object)`
* `log.info(error: Error)`
* `log.info(error: Error), object: object)`

Any possible input is always "logged" as a JSON object
```
{
  level: "<log level>",
  time: "${new Date()}",
  message: "<message|error.message>",
  stage: process.env.STAGE,
  meta: {
    // anything defined in the object passed to the log
    // error.stacktrace if defined
  }
}

```

If `process.env.LOGGY_CW_GROUPNAME` is defined, logs are sent to Cloudwatch. 
If `process.env.AWS_LAMBDA_FUNCTION_NAME` is set, then logs are sent only to the console. AWS Lambda automajically send them to CloudWatch 


AWS credentials are taken from env or from EC2 role. AWS_REGION should always be set as an ENV (aws sdk limitation) 

## How to use
Install the module `npm install --save @my-ideas/loggy` and then use it in your code
```javascript

const Loggy = require('./index');

const log = new Loggy({env: 'environment'});

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
