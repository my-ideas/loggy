require('dotenv').config();
const Loggy = require('../../index');
const expect = require("chai").expect;

describe("Loggy behaviour", function () {


    before(() => {
        process.env.STAGE = "myTEST";
        process.env.LOGGY_CW_GROUPNAME = '/test/loggs';
    });

    it("Throw an exception if the first argument is not astring", function () {
        return new Promise((resolve, reject) => {
            try {
                new Loggy();
                return reject(new Error("Constructor should raise an exception if the first argument is a string"));
            }
            catch (e) {
                return resolve(e);
            }
        });
    });

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    function logInfo(arg1, arg2) {
        return new Promise((resolve, reject) => {
            const l = new Loggy(__filename, {}, stmt => {
                resolve(stmt)
            });
            l.info.apply(l, arguments);
        });

    }

    it("Log a string", function() {
        return logInfo("ciao")
            .then(stmt => {
                console.log(stmt)
                expect(JSON.parse(stmt)).to.deep.nested.include({
                    "message": "ciao",
                    "level": "info",
                    "stage": "myTEST",
                    "meta": {
                        "__script": "Test.Requirements.js"
                    }
                })
            });
    });

    it("Log a string and an object", function() {
        return logInfo("ciao", {akey: {a: "value"}})
            .then(stmt => {
                expect(JSON.parse(stmt)).to.deep.nested.include({
                    "message": "ciao",
                    "level": "info",
                    "stage": "myTEST",
                    "meta": {
                        "akey": {"a": "value"},
                        "__script": "Test.Requirements.js",
                    }
                });
            });
    });

    it("Log an Error", function() {
        return logInfo(new Error("Something happened!"))
            .then(stmt => {
                expect(JSON.parse(stmt)).to.deep.nested.include({
                    "message": "Something happened!",
                    "level": "info",
                    "stage": "myTEST",
                    "meta": {
                        "__script": "Test.Requirements.js",
                        "error": {
                            "stack": "Error: Something happened!\n    at Context.<anonymous> (/Users/totomz/Documents/my-ideas/loggy/test/Test.Requirements.js:67:24)\n    at callFn (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runnable.js:372:21)\n    at Test.Runnable.run (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runnable.js:364:7)\n    at Runner.runTest (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:455:10)\n    at /Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:573:12\n    at next (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:369:14)\n    at /Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:379:7\n    at next (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:303:14)\n    at Immediate.<anonymous> (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:347:5)\n    at runCallback (timers.js:800:20)\n    at tryOnImmediate (timers.js:762:5)\n    at processImmediate [as _immediateCallback] (timers.js:733:5)",
                            "message": "Something happened!"
                        }
                    }
                });
            });
    });

    it("Log a message and an Error", function() {
        return logInfo("An error occurred", new Error("Something happened!"))
            .then(stmt => {
                expect(JSON.parse(stmt)).to.deep.nested.include({
                    "message": "An error occurred",
                    "level": "info",
                    "stage": "myTEST",
                    "meta": {
                        "__script": "Test.Requirements.js",
                        "error": {
                            "stack": "Error: Something happened!\n    at Context.<anonymous> (/Users/totomz/Documents/my-ideas/loggy/test/Test.Requirements.js:85:45)\n    at callFn (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runnable.js:372:21)\n    at Test.Runnable.run (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runnable.js:364:7)\n    at Runner.runTest (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:455:10)\n    at /Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:573:12\n    at next (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:369:14)\n    at /Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:379:7\n    at next (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:303:14)\n    at Immediate.<anonymous> (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:347:5)\n    at runCallback (timers.js:800:20)\n    at tryOnImmediate (timers.js:762:5)\n    at processImmediate [as _immediateCallback] (timers.js:733:5)",
                            "message": "Something happened!"
                        }
                    }
                });
            });
    });

    it("Log an Error and an object", function() {
        return logInfo(new Error("Something happened!"), {akey: "mbuti", daje: {sempre: 44}})
            .then(stmt => {
                expect(JSON.parse(stmt)).to.deep.nested.include({
                    "message": "Something happened!",
                    "level": "info",
                    "stage": "myTEST",
                    "meta": {
                        "__script": "Test.Requirements.js",
                        "error": {
                            "message": "Something happened!",
                            "stack": "Error: Something happened!\n    at Context.<anonymous> (/Users/totomz/Documents/my-ideas/loggy/test/Test.Requirements.js:103:24)\n    at callFn (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runnable.js:372:21)\n    at Test.Runnable.run (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runnable.js:364:7)\n    at Runner.runTest (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:455:10)\n    at /Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:573:12\n    at next (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:369:14)\n    at /Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:379:7\n    at next (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:303:14)\n    at Immediate.<anonymous> (/Users/totomz/Documents/my-ideas/loggy/node_modules/mocha/lib/runner.js:347:5)\n    at runCallback (timers.js:800:20)\n    at tryOnImmediate (timers.js:762:5)\n    at processImmediate [as _immediateCallback] (timers.js:733:5)"
                        },
                        "akey": "mbuti",
                        "daje": {"sempre": 44}
                    }
                });
            });
    });


    // TODO with data override

    it("bum", function () {
        new Loggy().info("cao");
    })
});