require('dotenv').config();
process.env.AWS_LAMBDA_FUNCTION_NAME = "lalla";
const Loggy = require('./../index');
const log = new Loggy(__filename, {env: 'environment'});


log.info("A simple message");
log.debug("A simple DEBUG message");
log.debug("A message", {
    context: "this is a context object",
    daje: true
});

log.error(new Error("How to log an error?"));