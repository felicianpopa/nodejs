// NPM Packages
const { v4: uuid } = require("uuid"); // import v4 as uuid
const { format } = require("date-fns");

// Common core modules
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, fileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "logs", fileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;
