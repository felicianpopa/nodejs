const logEvents = require("./logEvents");

// Common core modules
const EventEmitter = require("events");
const { setTimeout } = require("timers");

class MyEmitter extends EventEmitter {}

//initialize object
const myEmitter = new MyEmitter();

// add listener fot the log event
myEmitter.on("log", (msg) => logEvents(msg));

// Emit event
setTimeout(() => {
  myEmitter.emit("log", "Event emitted");
}, 1000);
