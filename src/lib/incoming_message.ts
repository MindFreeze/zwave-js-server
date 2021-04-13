import { LogConfig } from "@zwave-js/core";
import { IncomingMessageController } from "./controller/incoming_message";
import { ServerCommand } from "./command";
import { IncomingCommandBase } from "./incoming_message_base";
import { IncomingMessageNode } from "./node/incoming_message";
import { IncomingMessageDriver } from "./driver/incoming_message";

interface IncomingCommandStartListening extends IncomingCommandBase {
  command: ServerCommand.startListening;
}

interface IncomingCommandUpdateLogConfig extends IncomingCommandBase {
  command: ServerCommand.updateLogConfig;
  config: Partial<LogConfig>;
}

interface IncomingCommandGetLogConfig extends IncomingCommandBase {
  command: ServerCommand.getLogConfig;
}

interface IncomingCommandSetApiSchema extends IncomingCommandBase {
  command: ServerCommand.setApiSchema;
  schemaVersion: number;
}

export type IncomingMessage =
  | IncomingCommandStartListening
  | IncomingCommandUpdateLogConfig
  | IncomingCommandGetLogConfig
  | IncomingCommandSetApiSchema
  | IncomingMessageNode
  | IncomingMessageController
  | IncomingMessageDriver;
