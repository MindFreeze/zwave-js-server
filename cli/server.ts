import mininist from "minimist";
import { resolve } from "path";
import { Driver } from "zwave-js";
import express from "express";
import { addAPItoExpress } from "../lib/express";

interface Args {
  _: Array<string>;
  config?: string;
}
const expectedConfig = ["_", "config"];

(async () => {
  const args: Args = mininist(process.argv.slice(2));

  const extraKeys = Object.keys(args).filter(
    (key) => !expectedConfig.includes(key)
  );
  if (extraKeys.length > 0) {
    console.error(`Got unexpected keys ${extraKeys.join(", ")}`);
    return;
  }

  if (args._.length < 1) {
    console.error("Error: Missing path to serial port");
    return;
  }

  const serialPort = args._[0];

  let configPath = args.config;
  if (configPath.substring(0, 1) !== "/") {
    configPath = resolve(process.cwd(), configPath);
  }

  let options = undefined;

  if (configPath) {
    try {
      options = require(configPath);
    } catch (err) {
      console.error(`Error: failed loading config file ${configPath}`);
      console.error(err);
      return;
    }
  }

  const driver = new Driver(serialPort, options);

  driver.on("error", (e) => {
    console.error("Error in driver", e);
  });

  driver.on("driver ready", () => {
    const app = express();
    addAPItoExpress(app.listen(3000), driver);
  });

  await driver.start();
})().catch((err) => {
  console.error("Unable to start driver", err);
});