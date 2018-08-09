require('dotenv').config();
// process.env.AWS_LAMBDA_FUNCTION_NAME = "lalla";
const Loggy = require('./../index');
const log = new Loggy(__filename, {env: 'environment'});

// log.error(new Error("How to log an error?"));
// log.warn("Cosi e' comodo",{uid: 'das auto'});
// log.info("Dajeeeeee");
// log.debug("A simple DEBUG message");
// log.debug("A message", {
//     context: "this is a context object",
//     daje: true
// });
// log.error(new Error("How to log an error?"));
// log.error("MEssage and error?", new Error("Another error"));


describe('Daje', function () {
    
    it('logs', function(done){
    
        // log.warn("Cosi e' comodo",{uid: 'das auto'});
        // log.info("Dajeeeeee");
        // log.debug("A simple DEBUG message");
        // log.debug("A message", {
        //     context: "this is a context object",
        //     daje: true
        // });
        
        
        log.error("A CRAZY MESSAGE", new Error("How to log an error?"));
        log.error(new Error("How to log an error?"));

        done();
    });
});  